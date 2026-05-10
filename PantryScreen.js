import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const dbPromise = SQLite.openDatabase({ name: "database.db", location: 'default' });

