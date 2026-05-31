import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatTextHeader from '../components/StatTextHeader';
import { getShoppingItems, insertShoppingItem, deleteShoppingItem, updateShoppingItemQuantity, getMissingShoppingItems, setShoppingItemPurchased } from '../src/shopping';
import { getFoods, insertFood } from '../src/food';
import { insertPantryItem } from '../src/pantry';
import { getUnitOfMeasureSymbols } from '../src/uom';

const ShoppingScreen = ({ db }) => {
    const [items, setItems] = useState([]);
    const [newName, setNewName] = useState('');
    const [newQty, setNewQty] = useState('1');
    const [newUnit, setNewUnit] = useState('g');
    const [units, setUnits] = useState([]);

    useFocusEffect(
        useCallback(() => {
            if (db) {
                fetchItems();
            }
        }, [db]));

    const fetchItems = async () => {
        const data = await getShoppingItems(db);
        const mappedData = data.map(dbItem => ({
            id: dbItem.id,
            name: dbItem.name,
            quantity: dbItem.quantity,
            unit: dbItem.unitOfMeasure === 2 ? 'ml' : 'g',
            selected: !!dbItem.purchased,
            category: "Generico",
            food: dbItem.food,
            unitOfMeasure: dbItem.unitOfMeasure
        }));
        setItems(mappedData);

        const us = await getUnitOfMeasureSymbols(db)
        setUnits(us)
    };

    const addItem = async () => {
        const productName = newName.trim();
        if (productName.length === 0) return;

        let uomId = 1;
        if (newUnit === 'ml') uomId = 2;

        const newItem = {
            name: productName,
            quantity: parseFloat(newQty) || 1,
            purchaseDate: new Date().toISOString().split('T')[0],
            unitOfMeasure: uomId
        };

        await insertShoppingItem(db, newItem);

        setNewName('');
        setNewQty('1');
        Keyboard.dismiss();
        await fetchItems();
    };

    const handleAutoGenerate = async () => {
        if (!db) return;
        try {

            const missingItems = await getMissingShoppingItems(db);

            if (!missingItems || missingItems.length === 0) {
                Alert.alert("Generazione", "La tua dispensa è già al completo in base ai piani!");
                return;
            }

            const currentShoppingItems = await getShoppingItems(db);

            for (const missing of missingItems) {
                if (missing.quantity > 0) {
                    const foodName = missing.name;
                    const existingShoppingItem = currentShoppingItems.find(item => item.name === missing.name && item.unitOfMeasure === missing.unitOfMeasure);
                    if (existingShoppingItem) {
                        const newTotalQuantity = Number((existingShoppingItem.quantity + missing.quantity).toFixed(1));
                        await updateShoppingItemQuantity(db, existingShoppingItem.id, newTotalQuantity);
                    } else {
                        await insertShoppingItem(db, {
                            name: foodName,
                            quantity: missing.quantity,
                            purchaseDate: new Date().toISOString().split('T')[0],
                            unitOfMeasure: missing.unitOfMeasure
                        });
                    }
                }
            }

            Alert.alert("Successo", "Lista della spesa aggiornata senza duplicati!");
            await fetchItems();
        } catch (error) {
            console.error("Errore generazione:", error);
            Alert.alert("Errore", "Impossibile generare la spesa.");
        }
    };

    const deleteItem = async (id) => {
        await deleteShoppingItem(db, id);
        await fetchItems();
    };

    const clearPurchasedItems = async () => {
        const purchasedItems = items.filter(item => item.selected);

        if (purchasedItems.length === 0) {
            Alert.alert("Info", "Non ci sono prodotti completati da rimuovere.");
            return;
        }

        try {
            for (const item of purchasedItems) {
                await deleteShoppingItem(db, item.id);
            }

            await fetchItems();
            Alert.alert("Successo", "Prodotti trasferiti in dispensa e rimossi dalla lista!");
        } catch (error) {
            Alert.alert("Errore", "Impossibile completare il trasferimento in dispensa.");
        }
    };

    const updateQuantity = async (id, currentQty, delta) => {
        const newVal = Math.max(0.1, currentQty + delta);
        const finalQty = Number(newVal.toFixed(1));
        await updateShoppingItemQuantity(db, id, finalQty);
        await fetchItems();
    };

    const toggleItem = async (id, currentSelected) => {
        const nextStatus = currentSelected ? 0 : 1;
        await setShoppingItemPurchased(db, id, nextStatus);
        await fetchItems();
    };

    const CustomCheckbox = ({ isChecked }) => (
        <View style={[styles.checkboxBase, isChecked && styles.checkboxChecked]}>
            {isChecked && <View style={styles.checkmark} />}
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={[styles.card, item.selected && styles.cardSelected]}>
            <TouchableOpacity style={styles.cardContent} onPress={() => toggleItem(item.id, item.selected)}>
                <CustomCheckbox isChecked={item.selected} />
                <View style={styles.textContainer}>
                    <Text style={[styles.itemName, item.selected && styles.textSelected]}>
                        {item.name}
                    </Text>
                    <Text style={styles.itemDetail}>{item.quantity} {item.unit}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.quantityControls}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity, -0.5)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity, 0.5)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>✖</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerPadding}>
                <StatTextHeader text="Inserisci prodotto" />

                <View style={styles.addForm}>
                    <TextInput
                        style={[styles.input, { flex: 2 }]}
                        placeholder="Nome prodotto"
                        value={newName}
                        onChangeText={setNewName}
                    />
                    <TextInput
                        style={[styles.input, { flex: 0.8 }]}
                        placeholder="Qtà"
                        keyboardType="numeric"
                        value={newQty}
                        onChangeText={setNewQty}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addItem}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.unitSelector}>
                    {units.map(u => (
                        <TouchableOpacity
                            key={u}
                            style={[styles.unitBtn, newUnit === u && styles.unitBtnActive]}
                            onPress={() => setNewUnit(u)}
                        >
                            <Text style={[styles.unitBtnText, newUnit === u && styles.unitBtnTextActive]}>{u}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.actionButtonsRow}>
                    <TouchableOpacity style={[styles.actionBtn, styles.autoGenerateBtn]} onPress={handleAutoGenerate}>
                        <Text style={styles.autoGenerateBtnText}>Genera lista</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionBtn, styles.clearBtn]} onPress={clearPurchasedItems}>
                        <Text style={styles.clearBtnText}>Rimuovi comprati</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    headerPadding: { paddingHorizontal: 20, marginBottom: 10 },
    addForm: { flexDirection: 'row', marginTop: 15, gap: 8 },
    input: {
        backgroundColor: '#F0FAF4', borderRadius: 10, paddingHorizontal: 12,
        height: 48, borderWidth: 1, borderColor: '#C6E8D2', color: '#1F5C3A'
    },
    addButton: {
        backgroundColor: '#2D7A4F', width: 48, height: 48,
        borderRadius: 10, justifyContent: 'center', alignItems: 'center'
    },
    addButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    unitSelector: { flexDirection: 'row', gap: 6, marginTop: 10 },
    unitBtn: {
        paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8,
        borderWidth: 1, borderColor: '#C6E8D2', backgroundColor: '#fff'
    },
    unitBtnActive: { backgroundColor: '#2D7A4F', borderColor: '#2D7A4F' },
    unitBtnText: { fontSize: 12, color: '#52A876' },
    unitBtnTextActive: { color: '#fff', fontWeight: 'bold' },
    actionButtonsRow: { flexDirection: 'row', gap: 10, marginTop: 15, justifyContent: 'space-between', },
    actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, },
    autoGenerateBtn: { backgroundColor: '#F0FAF4', borderColor: '#2D7A4F', },
    autoGenerateBtnText: { color: '#2D7A4F', fontWeight: 'bold', fontSize: 14, },
    clearBtn: { backgroundColor: '#F0FAF4', borderColor: '#2D7A4F', },
    clearBtnText: { color: '#2D7A4F', fontWeight: 'bold', fontSize: 14, },
    list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
    card: { backgroundColor: '#F0FAF4', padding: 12, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#C6E8D2', flexDirection: 'row', alignItems: 'center' },
    cardSelected: { opacity: 0.5 },
    cardContent: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    textContainer: { marginLeft: 12 },
    itemName: { fontSize: 16, fontWeight: '600', color: '#1F5C3A' },
    textSelected: { textDecorationLine: 'line-through' },
    itemDetail: { fontSize: 12, color: '#52A876' },
    quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#C6E8D2' },
    qtyBtn: { paddingHorizontal: 10, paddingVertical: 5 },
    qtyBtnText: { fontSize: 18, fontWeight: 'bold', color: '#2D7A4F' },
    qtyText: { fontSize: 14, fontWeight: 'bold', color: '#1F5C3A', minWidth: 25, textAlign: 'center' },
    deleteButton: { marginLeft: 10, padding: 5 },
    deleteButtonText: { color: '#52A876', fontSize: 18, fontWeight: 'bold' },
    checkboxBase: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#2D7A4F', justifyContent: 'center', alignItems: 'center' },
    checkboxChecked: { backgroundColor: '#2D7A4F' },
    checkmark: { width: 10, height: 5, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: 'white', transform: [{ rotate: '-45deg' }] },
});

export default ShoppingScreen;
