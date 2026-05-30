import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { queryFirstAsync } from '../src/database';
import { getFoodCategories, getFoods, insertFood, updateFoodById } from '../src/food';
import { getUnitsOfMeasure } from '../src/uom';
import { deletePantryItem, getPantryItems, insertPantryItem, updatePantryItem } from '../src/pantry';

const PantryScreen = ({ route, db }) => {
    const [pantryItems, setPantryItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);

    useEffect(() => {
        if (db) {
            loadStaticData();
            fetchPantryItems();
        }
    }, [db]);

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
                    <TouchableOpacity style={styles.deleteButton} onPress={() => removePantryItem(item.id)}>
                        <Text style={styles.actionIcon}>🗑</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEditClick(item)}>
                        <Text style={styles.actionIcon}>✏️</Text>
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

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Dispensa</Text>
            <FlatList
                data={pantryItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>La dispensa è vuota.</Text>}
            />

            <TouchableOpacity style={styles.fab} onPress={handleAddClick}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>


            <Modal visible={!!editingItem} animationType="slide" transparent={true}>
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
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={editingItem.category}
                                        onValueChange={(itemValue) => setEditingItem({ ...editingItem, category: itemValue })}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Seleziona una categoria..." value="" />
                                        {categories.map((cat) => (
                                            <Picker.Item key={cat.id} label={cat.description || cat.name} value={cat.description || cat.name} />
                                        ))}
                                    </Picker>
                                </View>
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
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={editingItem.unitOfMeasure}
                                        onValueChange={(itemValue) => setEditingItem({ ...editingItem, unitOfMeasure: itemValue })}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Seleziona unità di misura..." value="" />
                                        {units.map((u) => (
                                            <Picker.Item key={u.id} label={u.symbol} value={u.symbol} />
                                        ))}
                                    </Picker>
                                </View>
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
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f5e9',
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1b5e20',
        paddingHorizontal: 16,
        paddingTop: 24,
        textAlign: 'center',
    },
    list: {
        padding: 16,
        gap: 12,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#c8e6c9',
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    headerLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },
    badgeAndAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1b5e20', marginBottom: 4 },
    category: {
        fontSize: 14, color: '#2e7d32', backgroundColor: '#c8e6c9',
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: 'hidden', alignSelf: 'flex-start'
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
        fontSize: 20,
    },
    details: { gap: 4, flex: 1 },
    text: { fontSize: 14, color: '#495057' },
    warningText: { color: '#dc3545', fontWeight: 'bold' },
    note: { fontSize: 14, color: '#868e96', fontStyle: 'italic', marginTop: 4 },
    emptyText: { textAlign: 'center', color: '#868e96', marginTop: 20, fontSize: 16 },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1b5e20',
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#495057',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#c8e6c9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#c8e6c9',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 8,
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 40,
        backgroundColor: '#28a745',
        borderRadius: 30,
        elevation: 5,
    },
    fabIcon: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PantryScreen;
