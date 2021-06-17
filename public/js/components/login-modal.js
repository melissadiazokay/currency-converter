app.component('login-modal',{

  props: ['toggle'],

  /*html*/
  template: 
  `<div class="modal fade" :class="{ active: modalOpen }" >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h5 class="modal-title" >Login</h5>
            <div class="modal-subtitle">Enter your email address to retrieve saved conversions</div>
          </div>
          <button type="button" class="close" @click="modalClose" >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body pt-1">
          <div :class="{ invisible: !haveError }" class="pb-1 text-warning" >{{errorMessage}}</div>
          <input class="form-control" v-model="email" @keyup.enter="submit" />
          <div class="text-right mt-2">
            <button class="btn btn-invert" type="email" @click="submit">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>`,

  data(){

    return {
      active: false,
      email: '',
      haveError: false,
      errorMessage: '&nbsp;'
    }
  },

  computed: {

    modalOpen(){

      this.email = '';
      return this.toggle;
    }

  },

  methods: {

    modalClose(){

      this.$emit('modal-close');
    },

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    submit(){

      if(this.email.length > 0 && this.validateEmail(this.email)){

        this.$emit('log-in-success',{
          email: this.email,
          conversions: []
        });
        
        this.modalClose()

      } else {

        this.haveError = true;
        this.errorMessage = 'Please enter a valid email address.'
        setTimeout(function () { this.haveError = false; }.bind(this), 3000)
      }
    }

  },

});
