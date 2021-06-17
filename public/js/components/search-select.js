app.component('search-select', {

  props: {
    id: Number, 
    items: Array,
    placeholder: String
  }, 

  /*html*/
  template:

  `<div :id="'search-select-' + this.id" class="search-select">

    <div class="input-field">

      <i class="fa" :class="{ 'fa-times': this.showSearchResults, 'fa-chevron-down': !this.showSearchResults }" @click="searchOnChangeHandler" ></i>

      <input class="form-control" :class="{ active: searchResults.length > 0 }" :placeholder="this.placeholder" v-model="searchQuery" @keyup="searchOnChangeHandler" @click="searchOnChangeHandler" />

    </div>

    <div class="search-select-results" v-show="showSearchResults" >
      <ul>
        <li v-for="(result, index) in searchResults" @click="selectItem(index)" >{{result.name}} ({{result.symbol}})</li>
      </ul>
    </div>

    <div>{{selectedItem}}</div>

  </div>`,

  data(){

    return {
      searchQuery: '',
      selectedItem: '',
      searchResults: [],
    }
  },

  computed: {

    showSearchResults(){

      return this.searchResults.length > 0
    }

  },

  methods: {

    selectItem(itemIndex) {

      this.searchQuery = `${this.searchResults[itemIndex].name} (${this.searchResults[itemIndex].symbol})`;

      this.$emit('selected-item',{
        id: this.id,
        symbol: this.searchResults[itemIndex].symbol
      }) // emit event

      this.searchResults = [];
    },

    searchOnChangeHandler(e) {

      this.searchResults = [];

      // if close icon clicked, return from function with @searchResult empty, which will allow computed property @showSearchResults to be set accordingly
      if(e.target.classList.contains('fa-times')){
        return;
      }

      const query = e.target.value ? e.target.value.toLowerCase() : '';

      // handle case where user backspaces to clear the input field; search results dropdown should close automatically
      if(e.keyCode == 8 && query.length == 0){
        return;
      }

      // loop through items and return matching entries
      for(let i=0; i < this.items.length; i++){

        if(query.length > 0){

          // basic search pattern
          if(this.items[i].code.toLowerCase().includes(query)
          || this.items[i].name.toLowerCase().includes(query)){ 

            // MATCH!

            this.searchResults.push({ 
              symbol: this.items[i].code,
              name: this.items[i].name,
            });

          }

        } else { // for empty query, show all results. this handles case when user initally clicks on input field

          this.searchResults.push({ 
            symbol: this.items[i].code,
            name: this.items[i].name,
          });
        }

      }

    } 
       
  },

});