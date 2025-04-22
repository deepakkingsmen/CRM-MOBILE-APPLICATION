import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  View,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

// Icon map
const iconMap = {
  email: 'https://cdn-icons-png.flaticon.com/512/732/732200.png',
  whatsapp: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
  meeting: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
};

const filters = ['all', 'email', 'whatsapp', 'meeting'];

const App = () => {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = 'http://10.76.35.117:8081'; // Replace with actual backend IP if testing on a device

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
  
        // DUMMY DATA START
        const dummyEmail = [
          { name: 'John Doe', details: 'Sent product info', timestamp: new Date(), type: 'email' },
          { name: 'Alice Smith', details: 'Followed up on proposal', timestamp: new Date(), type: 'email' },
        ];
  
        const dummyWhatsapp = [
          { name: 'Bob Marley', details: 'Asked for pricing', timestamp: new Date(), type: 'whatsapp' },
        ];
  
        const dummyMeeting = [
          { name: 'Charlie Brown', details: 'Scheduled a Zoom meeting', timestamp: new Date(), type: 'meeting' },
        ];
  
        const allData = [...dummyEmail, ...dummyWhatsapp, ...dummyMeeting];
        setData(allData);
        // DUMMY DATA END
  
        // Uncomment below when using real API
        /*
        const [emailRes, whatsappRes, meetingRes] = await Promise.all([
          axios.get(`${baseURL}/email`),
          axios.get(`${baseURL}/whatsapp`),
          axios.get(`${baseURL}/meeting`),
        ]);
        const allData = [
          ...emailRes.data.map((d) => ({ ...d, type: 'email' })),
          ...whatsappRes.data.map((d) => ({ ...d, type: 'whatsapp' })),
          ...meetingRes.data.map((d) => ({ ...d, type: 'meeting' })),
        ];
        setData(allData);
        */
      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllData();
  }, []);
  



  console.log("data", data);


  const filtered = data.filter(
    (item) =>
      (filter === 'all' || item.type === filter) &&
      (item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.details?.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
     
      <View style={styles.filterBar}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f ? styles.activeFilter : styles.inactiveFilter,
            ]}
            onPress={() => setFilter(f)}
          >
            {f === 'all' ? (
              <Text style={styles.filterText}>All</Text>
            ) : (
              <Image source={{ uri: iconMap[f] }} style={styles.tabIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>


      <TextInput
        placeholder="Search..."
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
      />

      <View style={[styles.headerRow,{marginLeft:10}]}>
  <Text style={{ ...styles.headerText, flex: 2 }}>ACTIVITY</Text>
  <Text style={[{ ...styles.headerText, flex: 4}]}>SENDER</Text>
  <Text style={{ ...styles.headerText, flex: 4 }}>DETAILS</Text>
</View>


      {/* Loading or Data */}


       {loading ? (
        <ActivityIndicator size="large" color="#2ecc71" style={{ marginTop: 60 }} />
      ) : filtered.length > 0 ? (
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.cell}>
                <Image source={{ uri: iconMap[item.type] }} style={styles.icon} />
              </View>
              <Text style={styles.sender}>{item.name}</Text>
              <View style={[styles.detailsCell, { marginLeft: 5 }]}>

                <Text style={styles.details}>{item.details}</Text>
                <Text style={styles.timestamp}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noData}>No data found</Text>
      )}

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F6F1',
    
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    marginTop: 10,
  },
  filterButton: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 42,
  },
  activeFilter: {
    backgroundColor: '#d4f8d4',
    borderColor: '#2ecc71',
    borderWidth: 1,
  },
  inactiveFilter: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  filterText: {
    fontWeight: '600',
  },
  tabIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  searchInput: {
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    marginTop: 32,
  },
 headerRow: {
  flexDirection: 'row',
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  backgroundColor: 'lightyellow', // debug color
  height:40,

},

headerText: {
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize:12,
  flex: 1, 

},

  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    alignItems: 'center',
  
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  sender: {
    flex: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  detailsCell: {
    flex: 0.5,
    gap:15
    
     },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});

export default App;

