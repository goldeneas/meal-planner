import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useActionSheet, ActionSheetProvider } from '@expo/react-native-action-sheet';
import { queryFirstAsync } from '../src/database';
import { getFoodCategories, getFoods, insertFood, updateFoodById } from '../src/food';
import { getUnitsOfMeasure } from '../src/uom';
import { deletePantryItem, getPantryItems, insertPantryItem, updatePantryItem } from '../src/pantry';

const ActionSheetPicker = ({ title, options, value, placeholder, onSelect }) => {
    const { showActionSheetWithOptions } = useActionSheet();

    const showPicker = () => {
        const actionOptions = [...options, 'Annulla'];
        const cancelButtonIndex = actionOptions.length - 1;

        showActionSheetWithOptions({
            options: actionOptions,
            cancelButtonIndex,
            title
        }, (buttonIndex) => {
            if (buttonIndex !== cancelButtonIndex) {
                onSelect(actionOptions[buttonIndex]);
            }
        });
    };

    return (
        <TouchableOpacity style={styles.pickerContainer} onPress={showPicker}>
            <Text style={[styles.pickerText, !value && styles.pickerPlaceholder]}>
                {value || placeholder}
            </Text>
        </TouchableOpacity>
    );
};

const PantryScreen = ({ route, db }) => {
    const [pantryItems, setPantryItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);

    const [showExpiringOnly, setShowExpiringOnly] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (db) {
                loadStaticData();
                fetchPantryItems();
            }
        }, [db]));

    const loadStaticData = async () => {
        try {
            const cats = await getFoodCategories(db);
            setCategories(cats || []);
            const uoms = await getUnitsOfMeasure(db);
            setUnits(uoms || []);
        } catch (error) {
            console.error("Error loading static data:", error);
        }
    };

    const fetchPantryItems = async () => {
        if (!db) return;
        try {
            const rawItems = await getPantryItems(db);
            setPantryItems(rawItems);
        } catch (error) {
            console.error("Error fetching pantry items:", error);
            Alert.alert("Errore", "Impossibile caricare i prodotti della dispensa.");
        }
    };

    const handleEditClick = (item) => {
        setEditingItem({ ...item });
    };

    const handleAddClick = () => {
        setEditingItem({
            name: '',
            category: '',
            quantity: '',
            warningQuantity: '',
            unitOfMeasure: '',
            expirationDate: '',
            note: ''
        });
    };

    const saveEdit = async () => {
        if (!editingItem.name || !editingItem.category || !editingItem.unitOfMeasure || editingItem.quantity === '' || editingItem.quantity == null) {
            Alert.alert("Errore", "I campi Nome, Categoria, Quantità e Unità di misura sono obbligatori.");
            return;
        }

        if (isNaN(editingItem.quantity)) {
            Alert.alert("Errore", "La quantità deve essere un numero valido.");
            return;
        }

        if (editingItem.warningQuantity && isNaN(editingItem.warningQuantity)) {
            Alert.alert("Errore", "La soglia di avviso deve essere un numero valido.");
            return;
        }

        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (editingItem.expirationDate && !dateFormatRegex.test(editingItem.expirationDate)) {
            Alert.alert("Errore", "La data di scadenza deve essere nel formato YYYY-MM-DD.");
            return;
        }

        if (!db) {
            Alert.alert("Errore", "Database non pronto.");
            return;
        }

        try {
            let categoryId = categories.find(c => (c.description || c.name) === editingItem.category)?.id;
            let uomId = units.find(u => u.symbol === editingItem.unitOfMeasure)?.id;

            const safeName = editingItem.name.trim();
            const qty = parseFloat(editingItem.quantity) || 0;
            const warnQty = editingItem.warningQuantity ? parseFloat(editingItem.warningQuantity) : null;
            const expDate = editingItem.expirationDate || null;
            const note = editingItem.note || null;

            const foods = await getFoods(db);
            const existingFood = foods.find(f => f.name && f.name.toLowerCase() === safeName.toLowerCase());
            let foodId;
            if (existingFood) {
                foodId = existingFood.id;
                if (categoryId && existingFood.category !== categoryId) {
                    await updateFoodById(db, foodId, { name: existingFood.name, description: existingFood.description, category: categoryId });
                }
            } else {
                if (!categoryId) categoryId = 8;
                await insertFood(db, { name: safeName, description: '', category: categoryId });
                const res = await queryFirstAsync(db, 'SELECT last_insert_rowid() AS id');
                foodId = res.id;
            }

            if (editingItem.id) {
                await updatePantryItem(db, editingItem.id, { foodId, qty, warnQty, uomId, expDate, note })
            } else {
                await insertPantryItem(db, { foodId, qty, warnQty, uomId, expDate, note })
            }

            await fetchPantryItems();
            setEditingItem(null);
        } catch (error) {
            console.error("Error saving pantry item:", error);
            Alert.alert("Errore", "Impossibile salvare il prodotto.");
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setEditingItem({ ...editingItem, expirationDate: formattedDate });
        }
    };

    const isExpiringSoon = (expirationDate) => {
        if (!expirationDate) return false;
        const expDate = new Date(expirationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expDate.setHours(0, 0, 0, 0);
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
    };

    const removePantryItem = async (id) => {
        if (!db) return;
        try {
            await deletePantryItem(db, id)
            await fetchPantryItems();
        } catch (error) {
            console.error("Error deleting item:", error);
            Alert.alert("Errore", "Impossibile rimuovere il prodotto.");
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.category}>{item.category}</Text>
                </View>
                <View style={styles.badgeAndAction}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEditClick(item)}>
                        <Text style={styles.actionIcon}>▲</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => removePantryItem(item.id)}>
                        <Text style={styles.actionIcon}>✖</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.details}>
                    <Text style={[styles.text, item.warningQuantity != null && item.quantity <= item.warningQuantity && styles.warningText]}>
                        Quantità: {item.quantity} {item.unitOfMeasure} {item.warningQuantity != null && item.quantity <= item.warningQuantity ? '⚠️' : ''}
                    </Text>
                    {item.warningQuantity != null ? (
                        <Text style={styles.text}>Soglia avviso: {item.warningQuantity} {item.unitOfMeasure}</Text>
                    ) : null}
                    {item.expirationDate ? (
                        <Text style={[styles.text, isExpiringSoon(item.expirationDate) && styles.warningText]}>
                            Scadenza: {item.expirationDate} {isExpiringSoon(item.expirationDate) ? '⚠️' : ''}
                        </Text>
                    ) : null}
                    {item.note ? (
                        <Text style={styles.note}>Note: {item.note}</Text>
                    ) : null}
                </View>
            </View>
        </View>
    );

    const displayedPantryItems = pantryItems.filter(item => {
        if (showExpiringOnly) {
            return isExpiringSoon(item.expirationDate);
        }
        return true;
    });

    return (
        <View style={styles.container}>
            <View style={styles.filtersContainer}>
                <TouchableOpacity 
                    style={[styles.sortButton, showExpiringOnly && styles.sortButtonActive]} 
                    onPress={() => setShowExpiringOnly(!showExpiringOnly)}
                >
                    <Text style={[styles.sortButtonText, showExpiringOnly && styles.sortButtonTextActive]}>Mostra vicini alla scadenza</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={displayedPantryItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>La dispensa è vuota.</Text>}
            />

            <TouchableOpacity style={styles.fab} onPress={handleAddClick}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>


            <Modal visible={!!editingItem} animationType="slide" transparent={true}>
                <ActionSheetProvider>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingItem?.id ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</Text>
                        {editingItem && (
                            <ScrollView>
                                <Text style={styles.label}>Nome</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingItem.name}
                                    onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
                                />
                                <Text style={styles.label}>Categoria</Text>
                                <ActionSheetPicker
                                    title="Seleziona Categoria"
                                    options={categories.map(cat => cat.description || cat.name)}
                                    value={editingItem.category}
                                    placeholder="Seleziona una categoria..."
                                    onSelect={(val) => setEditingItem({ ...editingItem, category: val })}
                                />
                                <Text style={styles.label}>Quantità</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingItem.quantity.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setEditingItem({ ...editingItem, quantity: text })}
                                />
                                <Text style={styles.label}>Soglia di avviso</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingItem.warningQuantity != null ? editingItem.warningQuantity.toString() : ''}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setEditingItem({ ...editingItem, warningQuantity: text })}
                                />
                                <Text style={styles.label}>Unità di misura</Text>
                                <ActionSheetPicker
                                    title="Seleziona Unità di Misura"
                                    options={units.map(u => u.symbol)}
                                    value={editingItem.unitOfMeasure}
                                    placeholder="Seleziona unità di misura..."
                                    onSelect={(val) => setEditingItem({ ...editingItem, unitOfMeasure: val })}
                                />
                                <Text style={styles.label}>Scadenza</Text>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                    <View pointerEvents="none">
                                        <TextInput
                                            style={styles.input}
                                            value={editingItem.expirationDate || ''}
                                            placeholder="YYYY-MM-DD"
                                            editable={false}
                                        />
                                    </View>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={editingItem.expirationDate ? new Date(editingItem.expirationDate) : new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={onDateChange}
                                    />
                                )}
                                <Text style={styles.label}>Note</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingItem.note || ''}
                                    onChangeText={(text) => setEditingItem({ ...editingItem, note: text })}
                                />
                                <View style={styles.modalActions}>
                                    <View style={styles.buttonWrapper}>
                                        <Button title="Annulla" onPress={() => setEditingItem(null)} color="#dc3545" />
                                    </View>
                                    <View style={styles.buttonWrapper}>
                                        <Button title="Salva" onPress={saveEdit} color="#28a745" />
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
                </ActionSheetProvider>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1c1f1d',
        paddingHorizontal: 20,
        paddingTop: 24,
        textAlign: 'left',
    },
    list: {
        padding: 20,
        gap: 12,
    },
    card: {
        backgroundColor: '#F0FAF4',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#C6E8D2',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },
    badgeAndAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { fontSize: 18, fontWeight: 'bold', color: '#1F5C3A', marginBottom: 4, paddingHorizontal: 6 },
    category: {
        fontSize: 12, color: '#52A876', backgroundColor: '#fff',
        paddingHorizontal: 8, paddingVertical: 4, marginBottom: 4, borderRadius: 8, borderWidth: 1, borderColor: '#C6E8D2', overflow: 'hidden', alignSelf: 'flex-start'
    },
    editButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    deleteButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 18,
    },
    details: { gap: 4, flex: 1 },
    text: { fontSize: 14, color: '#52A876' },
    warningText: { color: '#dc3545', fontWeight: 'bold' },
    note: { fontSize: 13, color: '#7AB894', fontStyle: 'italic', marginTop: 4 },
    emptyText: { textAlign: 'center', color: '#7AB894', marginTop: 20, fontSize: 16 },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1F5C3A',
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#1F5C3A',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#C6E8D2',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#F0FAF4',
        color: '#1F5C3A',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#C6E8D2',
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: '#F0FAF4',
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: 12,
    },
    pickerText: {
        fontSize: 16,
        color: '#1F5C3A',
    },
    pickerPlaceholder: {
        color: '#7AB894',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 12,
    },
    buttonWrapper: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 30,
        backgroundColor: '#2D7A4F',
        borderRadius: 28,
        elevation: 4,
        shadowColor: '#2D7A4F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    fabIcon: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    filtersContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: '#fff',
    },
    sortButton: {
        paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10,
        borderWidth: 1, borderColor: '#C6E8D2', backgroundColor: '#fff',
        alignItems: 'center', marginBottom: 10,
    },
    sortButtonActive: { backgroundColor: '#2D7A4F', borderColor: '#2D7A4F' },
    sortButtonText: { fontSize: 14, color: '#2D7A4F', fontWeight: 'bold' },
    sortButtonTextActive: { color: '#fff' },
});

export default PantryScreen;
