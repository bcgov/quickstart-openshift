<template>
  <v-container align="center" class="fill-height">
    <h1 class="h1-style">Welcome to the Dashboard!!!</h1>
    <h3 class="h1-style">Users!!!</h3>
    <v-table density="compact" fixed-header height="35em">
      <thead>
      <tr>
        <th :id="headerItem.value" :key="headerItem.value" v-for="headerItem in headers" :class="headerItem.align">
          {{ headerItem.text }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="item in userDataSliced"
        :key="item['id']"
      >
        <td>{{ item['firstName'] }}</td>
        <td>{{ item['lastName'] }}</td>
        <td>{{ item['email'] }}</td>
        <td>{{ item['company'] }}</td>
        <td>{{ item['hire_date'] }}</td>
        <td>{{ item['salary'] }}</td>
      </tr>
      </tbody>
    </v-table>
    <v-row>
      <v-col cols="9">
        <v-pagination rounded="circle"
                      v-model="page"
                      :total-visible="10"
                      :length="numOfRecords"
        ></v-pagination>
      </v-col>
      <v-col cols="1">Rows Per Page:</v-col>
      <v-col cols="2" align-self="start" class="ma-0 pa-0">
       <v-select dense solo :items="rowsSelection" v-model="rowsSelected" class="ma-0 pa-0">
        </v-select>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">

import {computed, onMounted, ref} from 'vue'
import {getAxios} from "@/utils";
import type {AxiosRequestConfig} from "axios";

const userData = ref([]);
const rowsSelected = ref(15);
export default {
  setup() {
    const page = ref(1);
    onMounted(async () => {
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      const usersResponse = await getAxios().get('/users', config);
      userData.value = usersResponse.data;
    });
    const numOfRecords = computed( () => Math.ceil(userData.value?.length/rowsSelected.value));
    const userDataSliced = computed(()=> userData.value.slice(rowsSelected.value*(page.value-1),rowsSelected.value*(page.value)));
    return {
      page,
      numOfRecords,
      rowsSelection: [5, 10, 15, 20, 50],
      rowsSelected,
      userDataSliced,
      headers: [
        {
          text: 'First Name',
          align: 'start',
          sortable: true,
          value: 'firstName',
        },
        {
          text: 'Last Name',
          align: 'start',
          sortable: true,
          value: 'lastName',
        },
        {
          text: 'Email',
          align: 'start',
          sortable: true,
          value: 'email',
        },
        {
          text: 'Company',
          align: 'start',
          sortable: true,
          value: 'company',
        },
        {
          text: 'Hire Date',
          align: 'start',
          sortable: true,
          value: 'hire_date',
        },
        {
          text: 'Salary',
          align: 'start',
          sortable: true,
          value: 'salary',
        }
      ],
      userData
    };
  },
}

</script>

<style scoped>
.h1-style {
  color: cornflowerblue;
}
</style>
