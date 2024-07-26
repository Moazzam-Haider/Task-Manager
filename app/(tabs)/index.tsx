import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as TaskManager from 'expo-task-manager';

const Stack = createStackNavigator();

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tasks, setTasks] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const taskName = 'TASK_NAME';

    const defineTask = () => {
      TaskManager.defineTask(taskName, ({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        if (data) {
          console.log('Task executed with data:', data);
        }
      });
    };

    const startTask = async () => {
      try {
        await TaskManager.isTaskRegisteredAsync(taskName);
        await TaskManager.startTaskAsync(taskName);
      } catch (error) {
        console.log('Error starting task:', error);
      }
    };

    defineTask();
    startTask();

    return () => {
      TaskManager.unregisterTaskAsync(taskName);
    };
  }, []);

  const addTask = (task: { id: string; title: string }) => {
    setTasks([...tasks, task]);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Add Task" onPress={() => navigation.navigate('AddTask', { addTask })} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TaskDetail', { task: item })}>
            <Text style={{ fontSize: 18, padding: 10 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const AddTaskScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const [title, setTitle] = useState('');

  const handleAddTask = () => {
    if (title.trim()) {
      const task = { id: uuidv4(), title };
      navigation.navigate('Home', { task });
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
      />
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
};

const TaskDetailScreen: React.FC<{ route: any }> = ({ route }) => {
  const { task } = route.params as { task: { id: string; title: string } };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24 }}>{task.title}</Text>
    </View>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
