import Vue from "vue";
import Vuex from "vuex";
import * as firebase from "firebase";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [],
    user: null,
    loading: false,
    error: null,
    auction: null
  },
  mutations: {
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload;
    },
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload);
    },
    updateMeetup(state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id;
      });
      if (payload.title) {
        meetup.title = payload.title;
      }
      if (payload.price) {
        meetup.price = payload.price;
      }
      if (payload.description) {
        meetup.description = payload.description;
      }
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
    setAuction(state, payload) {
      state.auction = payload;
      //   console.log(payload);
    }
  },
  actions: {
    loadMeetups({ commit }) {
      commit("setLoading", true);
      const lots = firebase.database().ref("lots");
      lots
        .once("value")
        .then(data => {
          const meetups = [];
          const obj = data.val();
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              price: obj[key].price,
              bets: obj[key].bets,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl
            });
          }
          commit("setLoadedMeetups", meetups);
          commit("setLoading", false);
        })
        .catch(error => {
          //   console.log(error);
          commit("setLoading", false);
        });
    },
    loadAuction({ commit }) {
      firebase
        .database()
        .ref("auction")
        .once("value")
        .then(data => {
          commit("setAuction", data.val());
        });
    },
    createMeetup({ commit, getters }, payload) {
      return new Promise((resolve, reject) => {
        const meetup = {
          title: payload.title,
          price: payload.price,
          description: payload.description
        };
        let imageUrl = [];
        let key;
        firebase
          .database()
          .ref("lots")
          .push(meetup)
          .then(data => {
            key = data.key;
            return key;
          })
          .then(key => {
            var i = 0;
            // console.log("НАчинаю закидвыать картинки");
            payload.image.forEach(file => {
              // console.log({ file: file });
              i++;
              console.log(i);
              const filename = file.name;
              const ext = filename.slice(filename.lastIndexOf("."));
              firebase
                .storage()
                .ref("lots/" + key + i + ext)
                .put(file)
                .then(fileData => {
                  console.log("fileData");
                  console.log(
                    fileData.ref.getDownloadURL().then(function(downloadURL) {
                      imageUrl.push(downloadURL);
                      firebase
                        .database()
                        .ref("lots/" + key + "/")
                        .update({ imageUrl: imageUrl });
                    })
                  );
                })
                .catch(error => {
                  console.log("Не могу закинуть дату");
                  console.error(error);
                });
            });
          })
          .then(() => {
            commit("createMeetup", {
              ...meetup,
              imageUrl: [],
              id: key
            });
          })
          .catch(error => {
            // console.log(error);
          });
        // Reach out to firebase and store it
      });
    },
    updateMeetupData({ commit }, payload) {
      commit("setLoading", true);
      const updateObj = {};
      if (payload.title) {
        updateObj.title = payload.title;
      }
      if (payload.price) {
        updateObj.price = payload.price;
      }

      if (payload.description) {
        updateObj.description = payload.description;
      }
      firebase
        .database()
        .ref("lots")
        .child(payload.id)
        .update(updateObj)
        .then(() => {
          commit("setLoading", false);
          commit("updateMeetup", payload);
        })
        .catch(error => {
          console.log(error);
          commit("setLoading", false);
        });
    },
    signUserUp({ commit }, payload) {
      commit("setLoading", true);
      commit("clearError");
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit("setLoading", false);
          const newUser = {
            id: user.uid,
            email: user.email
          };
          commit("setUser", newUser);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
        });
    },
    signUserIn({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("setLoading", true);
        commit("clearError");
        firebase
          .auth()
          .signInWithEmailAndPassword(payload.email, payload.password)
          .then(user => {
            commit("setLoading", false);
            const newUser = {
              id: user.uid,
              email: user.email
            };
            commit("setUser", newUser);
            resolve({ message: "ok" });
          })
          .catch(error => {
            commit("setLoading", false);
            commit("setError", error);
            console.log(error);
            reject(error);
          });
      });
    },
    autoSignIn({ commit }, payload) {
      commit("setUser", { id: payload.uid, email: payload.email });
    },
    logout({ commit }) {
      firebase.auth().signOut();
      commit("setUser", null);
      window.location.href = "/meetups";
    },
    clearError({ commit }) {
      commit("clearError");
    }
  },
  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups;
    },
    auction(state) {
      return state.auction;
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0, 5);
    },
    loadedMeetup(state) {
      return meetupId => {
        return state.loadedMeetups.find(meetup => {
          return meetup.id === meetupId;
        });
      };
    },
    user(state) {
      return state.user;
    },
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    }
  }
});
