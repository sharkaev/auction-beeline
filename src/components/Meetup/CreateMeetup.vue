<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Добавить новый лот</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateMeetup">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="title"
                label="Название лота"
                id="title"
                v-model="title"
                required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="price"
                label="Цена"
                id="price"
                v-model="price"
                required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn raised class="primary" @click="onPickFile">Добавить фото</v-btn>
              <input 
              type="file" 
              style="display:none;" 
              ref="fileInput" 
              multiple
              accept="image/*"
              @change="onFilePicked">
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <img v-for="(img, key) in imageUrl" :src="img" height="150px" class="mr-2">
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
           <vue-editor v-model="description"></vue-editor>
            </v-flex>
          </v-layout>

          
         
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn
                class="primary"
                :disabled="!formIsValid"
                type="submit">Создать лот</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { setTimeout } from "timers";
export default {
  components: {
    VueEditor
  },
  data() {
    return {
      description:
        "<p><strong>Наименование:</strong></p> <p><strong>Описание:</strong></p> <p><strong>Количество:</strong></p> <p><strong>Цвет:</strong></p> <p><strong>Состояние мебели:</strong></p> ",
      title: "",
      price: "",
      imageUrl: [],
      image: []
      // imageUrl1: '',
      // imageUrl2: '',
      // imageUrl3: '',
    };
  },
  computed: {
    formIsValid() {
      return (
        this.title !== "" &&
        this.price !== "" &&
        this.imageUrl1 !== "" &&
        this.imageUrl2 !== "" &&
        this.imageUrl3 !== "" &&
        this.description !== ""
      );
    }
  },
  methods: {
    onCreateMeetup() {
      if (!this.formIsValid) {
        return;
      }
      const meetupData = {
        title: this.title,
        price: this.price,
        image: this.image,
        description: this.description
      };
      console.log("images before creation", meetupData);
      this.$store.dispatch("createMeetup", meetupData);
      this.title = "";
      this.price = "";
      this.description =
        "<p><strong>Наименование:</strong></p> <p><strong>Описание:</strong></p> <p><strong>Количество:</strong></p> <p><strong>Цвет:</strong></p> <p><strong>Состояние мебели:</strong></p> ";
      this.image = [];
      this.imageUrl = [];
    },

    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        console.log(files);
        let filename = files[i].name;
        if (filename.lastIndexOf(".") <= 0) {
          return alert("Please add a valid file!");
        }
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.imageUrl.push(fileReader.result);
        });
        fileReader.readAsDataURL(files[i]);
        this.image.push(files[i]);
      }
    }
  }
};
</script>

<style>
h1 {
  font-size: 2rem;
}
</style>