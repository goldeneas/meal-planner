import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, Keyboard, Alert } from 'react-native';
import StatTextHeader from '../components/StatTextHeader';

const ShoppingScreen = () => {
    const [items, setItems] = useState([
        { id: 1, name: "Farina 00", quantity: 1, unit: "kg", selected: false, category: "Cereali" },
        { id: 2, name: "Uova", quantity: 6, unit: "pz", selected: false, category: "Proteine" },
    ]);
    
    const [newName, setNewName] = useState('');
    const [newQty, setNewQty] = useState('1');
    const [newUnit, setNewUnit] = useState('pz');

    const units = ['pz', 'kg', 'g', 'l', 'ml'];

    const addItem = () => {
        if (newName.trim().length === 0) return;
        const newItem = {
            id: Date.now(),
            name: newName,
            quantity: parseFloat(newQty) || 1,
            unit: newUnit,
            selected: false,
            category: "Generico"
        };
        setItems([...items, newItem]);
        setNewName('');
        setNewQty('1');
        Keyboard.dismiss();
    };

    const deleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newVal = Math.max(0.1, item.quantity + delta);
                return { ...item, quantity: Number(newVal.toFixed(1)) };
            }
            return item;
        }));
    };

    const toggleItem = (id) => {
        setItems(prev => prev.map(item => 
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    const CustomCheckbox = ({ isChecked }) => (
        <View style={[styles.checkboxBase, isChecked && styles.checkboxChecked]}>
            {isChecked && <View style={styles.checkmark} />}
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={[styles.card, item.selected && styles.cardSelected]}>
            <TouchableOpacity style={styles.cardContent} onPress={() => toggleItem(item.id)}>
                <CustomCheckbox isChecked={item.selected} />
                <View style={styles.textContainer}>
                    <Text style={[styles.itemName, item.selected && styles.textSelected]}>
                        {item.name}
                    </Text>
                    <Text style={styles.itemDetail}>{item.quantity} {item.unit}</Text>
                </View>
            </TouchableOpacity>
            
            <View style={styles.quantityControls}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, -0.5)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 0.5)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPadding}>
                <StatTextHeader text="Shopping List" />
                
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

                <TouchableOpacity 
                    style={styles.autoGenerateBtn} 
                    onPress={() => Alert.alert("Auto-Generate", "Analisi dispensa e pasti in corso...")}
                >
                    <Text style={styles.autoGenerateBtnText}>Auto-Generate from Meals</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
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
    autoGenerateBtn: {
        backgroundColor: '#F0FAF4', borderWidth: 1, borderColor: '#2D7A4F',
        padding: 12, borderRadius: 12, marginTop: 15, alignItems: 'center'
    },
    autoGenerateBtnText: { color: '#2D7A4F', fontWeight: 'bold' },
    list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
    card: {
        backgroundColor: '#F0FAF4', padding: 12, borderRadius: 16,
        marginBottom: 10, borderWidth: 1, borderColor: '#C6E8D2',
        flexDirection: 'row', alignItems: 'center'
    },
    cardSelected: { opacity: 0.5 },
    cardContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    textContainer: { marginLeft: 12 },
    itemName: { fontSize: 16, fontWeight: '600', color: '#1F5C3A' },
    textSelected: { textDecorationLine: 'line-through' },
    itemDetail: { fontSize: 12, color: '#52A876' },
    quantityControls: { 
        flexDirection: 'row', alignItems: 'center', 
        backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#C6E8D2'
    },
    qtyBtn: { paddingHorizontal: 10, paddingVertical: 5 },
    qtyBtnText: { fontSize: 18, fontWeight: 'bold', color: '#2D7A4F' },
    qtyText: { fontSize: 14, fontWeight: 'bold', color: '#1F5C3A', minWidth: 25, textAlign: 'center' },
    deleteButton: { marginLeft: 10, padding: 5 },
    deleteButtonText: { color: '#FF6B6B', fontSize: 18, fontWeight: 'bold' },
    checkboxBase: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#2D7A4F', justifyContent: 'center', alignItems: 'center' },
    checkboxChecked: { backgroundColor: '#2D7A4F' },
    checkmark: { width: 10, height: 5, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: 'white', transform: [{ rotate: '-45deg' }] },
});

export default ShoppingScreen;