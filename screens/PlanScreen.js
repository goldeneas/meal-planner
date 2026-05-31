import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Button, Alert } from 'react-native';

import { getMealsByDayOfWeek, insertMeal, deleteMealById } from '../src/meal';
import { getTimeSlots } from '../src/timeslot';
import { getRecipes } from '../src/recipe';
import { executeAsync } from '../src/database';

const MealCard = ({ mealName, onPress, onEdit, onDelete }) => (
    <View style={styles.card}>
        <TouchableOpacity style={styles.cardContent} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.recipeTitle}>{mealName}</Text>
        </TouchableOpacity>

        <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                <Text style={styles.actionIcon}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                <Text style={styles.actionIcon}>🗑</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const EmptyMealCard = ({ mealType, onAdd }) => (
    <TouchableOpacity style={styles.emptyCard} onPress={onAdd}>
        <Text style={styles.addIcon}>+</Text>
        <Text style={styles.addText}>Aggiungi {mealType}</Text>
    </TouchableOpacity>
);

const MealSection = ({ title, meals, slotId, recipes, navigation, onAdd, onEdit, onDelete }) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {meals && meals.length > 0 && meals.map((meal) => {
            const recipeData = recipes.find(r => r.id === meal.recipe);
            const recipeName = recipeData ? recipeData.name : `Ricetta ID ${meal.recipe}`;

            return (
                <MealCard
                    key={meal.id}
                    mealName={recipeName}
                    onPress={() => navigation.navigate('Recipes', { openRecipeId: meal.recipe })}
                    onEdit={() => onEdit(slotId, meal.id)}
                    onDelete={() => onDelete(slotId, meal.id)}
                />
            );
        })}
        <EmptyMealCard
            mealType={meals && meals.length > 0 ? "un altro pasto" : (title ? title.toLowerCase() : 'pasto')}
            onAdd={() => onAdd(slotId)}
        />
    </View>
);

export default function PlanScreen({ navigation, db }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]);
    const [dayMeals, setDayMeals] = useState({});
    const [recipes, setRecipes] = useState([]);

    const [isModalVisible, setModalVisible] = useState(false);
    const [activeSlotForAdd, setActiveSlotForAdd] = useState(null);
    const [editingMealId, setEditingMealId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!db) return;
            try {
                const slots = await getTimeSlots(db);
                setTimeSlots(slots || []);
                const allRecipes = await getRecipes(db);
                setRecipes(allRecipes || []);
            } catch (error) {
                console.error("Errore nel caricamento dei dati iniziali:", error);
            }
        };
        loadInitialData();
    }, [db]);

    useEffect(() => {
        const loadMealsForDay = async () => {
            if (!db || timeSlots.length === 0) return;
            try {
                const jsDay = selectedDate.getDay();
                const dowId = jsDay === 0 ? 7 : jsDay;
                const mealsForToday = await getMealsByDayOfWeek(db, dowId);
                const organizedMeals = {};
                timeSlots.forEach(slot => {
                    organizedMeals[slot.id] = (mealsForToday || []).filter(m => m.timeSlot === slot.id);
                });

                setDayMeals(organizedMeals);
            } catch (error) {
                console.error("Errore nel caricamento dei pasti:", error);
            }
        };

        loadMealsForDay();
    }, [selectedDate, timeSlots, refreshKey, db]);

    const handlePrevDay = () => {
        const prev = new Date(selectedDate);
        prev.setDate(selectedDate.getDate() - 1);
        setSelectedDate(prev);
    };

    const handleNextDay = () => {
        const next = new Date(selectedDate);
        next.setDate(selectedDate.getDate() + 1);
        setSelectedDate(next);
    };

    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const formattedDate = selectedDate.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

    const handleOpenAddModal = (slotId) => {
        setActiveSlotForAdd(slotId);
        setEditingMealId(null);
        setModalVisible(true);
    };

    const handleOpenEditModal = (slotId, mealId) => {
        setActiveSlotForAdd(slotId);
        setEditingMealId(mealId);
        setModalVisible(true);
    };

    const handleDeleteMeal = (slotId, mealId) => {
        Alert.alert(
            "Rimuovi Pasto",
            "Sei sicuro di voler rimuovere questa ricetta dalla pianificazione?",
            [
                { text: "Annulla", style: "cancel" },
                {
                    text: "Rimuovi", style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteMealById(db, mealId);
                            setRefreshKey(oldKey => oldKey + 1);
                        } catch (error) {
                            console.error("Errore cancellazione: ", error);
                        }
                    }
                }
            ]
        );
    };

    const handleSelectRecipe = async (recipeId) => {
        try {
            if (editingMealId) {
                await executeAsync(db, "UPDATE Meal SET recipe = ? WHERE id = ?", [recipeId, editingMealId]);
            } else {
                const jsDay = selectedDate.getDay();
                const dowId = jsDay === 0 ? 7 : jsDay;

                const newMeal = {
                    recipe: recipeId,
                    dayOfWeek: dowId,
                    timeSlot: activeSlotForAdd
                };
                await insertMeal(db, newMeal);
            }

            setModalVisible(false);
            setActiveSlotForAdd(null);
            setEditingMealId(null);
            setRefreshKey(oldKey => oldKey + 1);

        } catch (error) {
            console.error("Errore durante il salvataggio: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
                {timeSlots.map((slot) => (
                    <MealSection
                        key={slot.id}
                        slotId={slot.id}
                        title={slot.name}
                        meals={dayMeals[slot.id]}
                        recipes={recipes}
                        navigation={navigation}
                        onAdd={handleOpenAddModal}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteMeal}
                    />
                ))}
            </ScrollView>


            <View style={styles.dateSelectorContainer}>
                {!isToday && (
                    <TouchableOpacity style={styles.todayButton} onPress={() => setSelectedDate(new Date())}>
                        <Text style={styles.todayButtonText}>Torna ad oggi</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.dateRow}>
                    <TouchableOpacity style={styles.arrowButton} onPress={handlePrevDay}>
                        <Text style={styles.arrowText}>{"<"}</Text>
                    </TouchableOpacity>

                    <Text style={styles.dateText}>{formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}</Text>

                    <TouchableOpacity style={styles.arrowButton} onPress={handleNextDay}>
                        <Text style={styles.arrowText}>{">"}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingMealId ? "Sostituisci Ricetta" : "Scegli una Ricetta"}
                        </Text>

                        {recipes && recipes.length > 0 ? (
                            <FlatList
                                data={recipes}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.recipeListItem}
                                        onPress={() => handleSelectRecipe(item.id)}
                                    >
                                        <Text style={styles.recipeListText}>{item.name}</Text>
                                        <Text style={styles.recipeListSubText}>{item.category}</Text>
                                    </TouchableOpacity>
                                )}
                                style={{ maxHeight: 300 }}
                            />
                        ) : (
                            <Text style={styles.emptyText}>Nessuna ricetta disponibile. Aggiungine una nella sezione Ricette!</Text>
                        )}

                        <View style={{ marginTop: 16 }}>
                            <Button
                                title="Annulla"
                                onPress={() => {
                                    setModalVisible(false);
                                    setActiveSlotForAdd(null);
                                    setEditingMealId(null);
                                }}
                                color="#dc3545"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// --- STILI ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollArea: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    sectionContainer: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1c1f1d', marginBottom: 12 },

    card: {
        backgroundColor: '#F0FAF4',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#C6E8D2',
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 4
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 16,
        color: '#2D7A4F',
    },

    recipeTitle: { fontSize: 16, fontWeight: '600', color: '#1F5C3A' },
    emptyCard: {
        borderWidth: 1,
        borderColor: '#C6E8D2',
        borderStyle: 'dashed',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    addIcon: { fontSize: 18, color: '#52A876', fontWeight: 'bold', marginRight: 8 },
    addText: { fontSize: 14, color: '#52A876', fontWeight: '600' },
    dateSelectorContainer: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#C6E8D2',
        alignItems: 'center'
    },
    todayButton: {
        backgroundColor: '#F0FAF4',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#C6E8D2'
    },
    todayButtonText: { color: '#2D7A4F', fontSize: 13, fontWeight: '600' },
    dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    arrowButton: {
        backgroundColor: '#F0FAF4',
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#C6E8D2'
    },
    arrowText: { fontSize: 20, color: '#2D7A4F', fontWeight: 'bold' },
    dateText: { fontSize: 16, fontWeight: 'bold', color: '#1c1f1d' },
    modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
    modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 20, maxHeight: '85%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1F5C3A', textAlign: 'center' },
    recipeListItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0FAF4' },
    recipeListText: { fontSize: 16, color: '#1F5C3A', fontWeight: 'bold' },
    recipeListSubText: { fontSize: 12, color: '#52A876', marginTop: 4 },
    emptyText: { textAlign: 'center', color: '#7AB894', marginTop: 20, fontSize: 16, marginBottom: 20 }
});
