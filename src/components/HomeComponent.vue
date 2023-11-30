<template>
  <ion-content id="main-menu">
    <ion-refresher slot="fixed" @ionRefresh="refreshPage($event)" v-if="$route.path === '/tabs/home'">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
    <ion-toolbar class="q-pa-sm">
      <div class="app-name">
        DermaPlanner<span style="font-size: 11px;"> VSP</span>
      </div>
      <ion-buttons slot="end">
        <ion-button v-if="userInfo.isGuestUser === 0" @click="$router.push('/NewDraftCompanyBody')" >
          <input class="animation-head" id="toggle-heart" type="checkbox" :checked="sparkleButton"/>
          <label class="toggle-animation q-pa-sm" for="toggle-heart" aria-label="like">
            <ion-icon :icon="sparklesOutline" size="large" class="iconStyle"/>
          </label>
        </ion-button>
        <ion-button v-else-if="userInfo.isGuestUser === 1" @click="$router.push('/guestInfo')">
          <input class="animation-head" id="toggle-heart" type="checkbox" :checked="sparkleButton"/>
          <label class="toggle-animation q-pa-sm" for="toggle-heart" aria-label="like">
            <ion-icon :icon="sparklesOutline" size="large" class="iconStyle"/>
          </label>
        </ion-button>
        <ion-button @click="$router.push('/notifications')" color="secondary">
            <ion-icon :icon="notificationsOutline" size="large"/>
          </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <div>
      <!-- <div class="q-ma-md">
        <div class="app-name">
          DermaPlanner<span style="font-size: 11px;"> VSP</span>
        </div>
        <ion-menu-toggle>
          <ion-button @click="$router.push('/notifications')">
            <ion-icon :icon="notificationsOutline"/>
          </ion-button>
        </ion-menu-toggle>
      </div> -->
      <div
        v-if="activeBudget"
        class="active-budget-button"
        @click="goToActiveBudget"
      >
        Você possui um orçamento em andamento.<br> 
        <small> clique aqui para continuar</small>
      </div>

      <!-- <div v-for="(post,i) in 30" :key="i">
        <div style="height: 200px;">dfsdfassd</div>
      </div> -->

      <div v-for="(post,i) in posts" :key="i">
        <div v-if="i % 2 === 0">
          <div id="post" style="margin: 10px;color: var(--ion-color-primary);background-color: var(--ion-color-tertiary);border-radius: 0.4rem;overflow: hidden;">
            <img :src="utils.attachmentsAddress() + post.postData.resume.img.filename" style="">
            <div id="post-content" style="padding:10px">
              <h1 style="margin: 0px;font-family: Montserrat;font-size: 24px;;">{{post.postData.resume.title}}</h1>
              <p style="color: #6e6e6e;margin-top: 10px;">{{post.postData.resume.description}}</p>
              <h6
                @click="$router.push('/postDetail?postId=' + post._id)"
                style="font-weight: 500;text-align: end;"
                class="active-change-color"
              >
                Ler mais
              </h6>
            </div>
          </div>
        </div>
        <div v-else style="margin: 10px;">
          <h1 style="margin-bottom: 10px;margin-inline: 10px;font-family: Montserrat;font-size: 24px;;">{{post.postData.resume.title}}</h1>
          <img :src="utils.attachmentsAddress() + post.postData.resume.img.filename" style="border-radius: 0.4rem;">
          <p style="color: #6e6e6e;margin: 10px;text-align: justify;">{{post.postData.resume.description}}</p>
          <h6 
            @click="$router.push('/postDetail?postId=' + post._id)"
            class="active-change-color"
            style="color: var(--ion-color-secondary);font-weight: 500;text-align: end;margin: 10px;"
          >
            Ler mais
          </h6>
        </div>
        <hr v-if="i < posts.length - 1" style="margin: 20px;background-color: var(--ion-color-secondary-tint);">
      </div>
    </div>
    <div style="height: 100px;"></div>
    <div v-if="!isDesktop" ref="tabbarBlur" class="tabbar-blur"></div>
  </ion-content>
</template>

<script setup>
import { useFetch } from '../composables/fetch.js';
import utils from '../composables/utils.js';
import iSuitcase from '/src/assets/icons/suitcase.svg'
import CardPost from '../components/CardPost.vue'
import 'animate.css';
import {
  IonImg,
  IonCard,
  IonIcon,
  alertController,
  IonModal,
  IonHeader, IonToolbar, IonButtons, IonButton,
  IonContent,
  IonInfiniteScroll, IonInfiniteScrollContent,
  IonRefresher, IonRefresherContent,
  IonItem,
  IonLabel,IonAvatar,
  IonCardContent,
  IonRow,IonCol,
  IonTitle,
  IonList,
  IonMenu,IonMenuToggle,IonMenuButton
} from '@ionic/vue'
import { 
  add,
  arrowBack,
  close,
  pencilOutline,
  personOutline,
  closeOutline,
  logOutOutline,
  trashOutline,
  notificationsOutline,
  sparklesOutline
} from 'ionicons/icons';
import { useBackButton } from '@ionic/vue';
import { isPlatform } from '@ionic/vue';
// import pinchImage from './_PinchZoom.vue'
</script>

<script>

export default {
  name: 'HomeComponent',
  data () {
    return {
      isDesktop: isPlatform('desktop'),
      add,
      arrowBack,
      dialogImagePost: {
        open: false,
        image: null,
        type: null
      },
      sparkleButton: true,
      utils,
      userInfo: utils.presentUserInfo(),
      attachmentsAddress: null,
      posts: [],
      transition: {
        enter: 'slide-up',
        exit: 'slide-down'
      },
      backDropColor: 'rgba(255, 255, 255, 0.82)',
      cardActionsMenu: {
        open: false,
        data: null,
        isPostOwner: false
      },
      activeBudget: null,
      profileMenu: [
        { icon: pencilOutline, label: 'Editar perfil', callback: 'clkEditProfile' },
        { icon: personOutline, label: 'Dados pessoais', callback: 'clkPersonalData' },
        { icon: trashOutline, label: 'Excluir conta', callback: 'clkDeleteAccount' },
        { icon: logOutOutline, label: 'Sair', callback: 'clkExitApp' },
      ],
    }
  },
  watch: {
    $route(to) {
      if (to.path === '/tabs/home') {
        this.sparkleButton = true
        if (this.$route.query.postAction !== 'createGuestUser') this.getActiveOpportunitiesFromUser()
      }
    }
  },
  mounted () {
    this.getPosts()
    this.getActiveOpportunitiesFromUser()
    this.attachmentsAddress = utils.attachmentsAddress()
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) this.backDropColor = 'rgba(23, 23, 23, 0.89)'
    else this.backDropColor = 'rgba(255, 255, 255, 0.82)'
    const styles = getComputedStyle(document.documentElement);
  },
  methods: {
    backButtonManager () {
      useBackButton(9, () => {
        if (this.openStory) this.openStory = false
        if (this.dialogImagePost.open) this.dialogImagePost.open = false
      })
    },
    clkExitApp () {
      const opt = {
        serverName: 'authentication',
        route: '/disconnectFromAccount',
      }
      useFetch(opt).then(() => {
        this.$refs.menuDrawer.$el.close()
        this.$router.push('/login')
      })
    },
    clkEditProfile () {
      this.$router.push('/editProfile')
    },
    clkPersonalData () { this.$router.push('/profileAddressAndDocument') },
    async clkDeleteAccount () {
      const alert = await alertController.create({
          header: 'Quer mesmo deletar sua conta?',
          message: 'Depois que confirmar, sua conta será deletada e você não poderá recuperá-la.',
          buttons: [
            {
              text: 'Cancelar',
              handler: () => {
                ''
              },
            },
            {
              text: 'Confirmar',
              role: 'confirm',
              handler: () => {
                const opt = {
                  serverName: "authentication",
                  route: '/deleteAccount',
                }
                useFetch(opt).then(() => {
                  window.localStorage.clear()
                  this.$router.push('/login')
                })
              },
            },
          ],
        });

        await alert.present();
    },
    getActiveOpportunitiesFromUser () {
      const opt = {
        route: '/mobile/sales/getActiveOpportunitiesFromUser',
      }
      // utils.loading.show()
      useFetch(opt).then( r => {
        // utils.loading.hide()
        this.activeBudget = r.data
      })
    },
    goToActiveBudget () {
      const route = '/newDraftComplaintSelection?opportunityId='
      this.$router.push(route + this.activeBudget.opportunityId)
    },
    clkMenuItem (item) {
      this.openUserOptions = false
      this[item.callback]()
    },
    refreshPage (event) {
      this.getPosts({ fromRefresh: true, event })
    },
    getPosts (obj) {
      console.log('entrou no get posts')
      const opt = {
        method: 'POST',
        route: '/mobile/social/getPosts',
      }
			useFetch(opt).then(r => {
        this.posts = r.data
        if (obj && obj.fromRefresh) obj.event.target.complete()
      })
    },
  },
}
</script>

<style scoped lang="scss">
$bubble-d: 4.5rem; // bubble diameter
$bubble-r: .5*$bubble-d; // bubble-radius
$sparkle-d: .30rem;
$sparkle-r: .5*$sparkle-d;

@mixin sparkles($k) {
	$shadow-list: ();
	$n-groups: 7;
	$group-base-angle: 360deg/$n-groups;
	$group-distr-r: (.6 + $k*.25)*$bubble-r;
	$n-sparkles: 2;
	$sparkle-base-angle: 360deg/$n-sparkles;
	$sparkle-off-angle: 60deg; // offset angle from radius
	$spread-r: -$k*$sparkle-r;
	
	@for $i from 0 to $n-groups {
		$group-curr-angle: $i*$group-base-angle - 90deg;
		$xg: $group-distr-r*cos($group-curr-angle);
		$yg: $group-distr-r*sin($group-curr-angle);
		
		@for $j from 0 to $n-sparkles {
			$sparkle-curr-angle: $group-curr-angle + 
				$sparkle-off-angle + $j*$sparkle-base-angle;
			$xs: $xg + $sparkle-d*cos($sparkle-curr-angle);
			$ys: $yg + $sparkle-d*sin($sparkle-curr-angle);
			
			$shadow-list: $shadow-list, $xs $ys 0 $spread-r 
				// hsl(($i + $j)*$group-base-angle, 100%, 75%);
		}
	}
	
	box-shadow: $shadow-list;
}

@mixin bubble($ext) {
	transform: scale(1);
	border-color: #cc8ef5;
	border-width: $ext;
}


.animation-head {
  position: absolute;
  left: -100vw;
  // Defina o estado padrão como checked
  &:checked + label,
  &:checked:focus + label {
    color: #cac7be;
    filter: none;
    will-change: font-size;
    // Adicione infinite à propriedade animation-iteration-count
    animation: heart 1s cubic-bezier(0, 0, 0, 0) infinite;
    
    &:before, &:after {
      animation: inherit;
      animation-timing-function: ease-out;
    }
    
    &:before {
      will-change: transform, border-width, border-color;
      animation-name: bubble;
    }
    
    &:after {
      will-change: opacity, box-shadow;
      animation-name: sparkles;
    }
  }
  
  &:focus + label {
    text-shadow: 0 0 3px white, 
      0 1px 1px white, 0 -1px 1px white, 
      1px 0 1px white, -1px 0 1px white;
  }
}

.toggle-animation {
	align-self: center;
	position: relative;
	color: #888;
	font-size: 2em;
	filter: grayscale(1);
	user-select: none;
	cursor: pointer;
	
	&:before, &:after {
		position: absolute;
		z-index: 1;
		top: 40%; left: 50%;
		border-radius: 50%;
		content: '';
	}
	
	// &:before {
	// 	box-sizing: border-box;
	// 	margin: -$bubble-r;
	// 	border: solid $bubble-r #e2264d;
	// 	width: $bubble-d; height: $bubble-d;
	// 	transform: scale(0);
	// }
	
	&:after {
		margin: -$sparkle-r;
		width: $sparkle-d; height: $sparkle-d;
		@include sparkles(1);
	}
}

// @keyframes heart {
// 	0%, 17.5% { font-size: 0; }
// }

@keyframes bubble {
	15% { @include bubble($bubble-r); }
	30%, 100% { @include bubble(0); }
}

@keyframes sparkles {
	0%, 20% { opacity: 0; }
	25% {
		opacity: 1;
		@include sparkles(0);
	}
}


.app-name {
  color: var(--ion-color-primary);
  font-family: Noto;
  font-size: 27px;
  font-weight: 500;
}

ion-modal,
ion-content,
ion-header,
ion-toolbar {
  --background: transparent;
}

.imageModal {
  background: rgba(23, 23, 23, 0.89)
}

.iframe-class {
  width: 100%;
  height: 100%;
  border: 0px
}

.center-image {
  margin-top: auto;
  margin-bottom: auto;
}

.my-card {
  box-shadow: 0px 0px 5px -2px;
  border-radius: 13px
}

.my-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
}
.vertical-center{
  align-self:flex-start;
}

.modal {
  transition: transform 0.3s ease-out;
  display: flex;
  align-items: top;
}

.swiper-card {
  height: 290px;
  margin-inline:10px;
  border-radius: 0.4rem;
  overflow: hidden;
  background: var(--ion-color-tertiary);
}

.active-change-color:active {
  color: var(--ion-color-secondary-tint);
}

.active-change-color {
  margin: 5px;
  color: var(--ion-color-secondary);
}
.active-budget-button {
  background-color: var(--ion-color-secondary);
  color: var(--ion-color-background);
  margin-inline: 10px;
  padding: 10px;
  border-radius: 0.4rem;
}
.active-budget-button:active {
  opacity: 0.85;
}
ion-menu::part(backdrop) {
    background-color: rgb(87, 47, 8);
    opacity: 1;
  }
ion-menu::part(container) {
  border-radius: 10px 0 0 10px;

  box-shadow: 4px 0px 16px rgb(111, 80, 43);
}
ion-menu {
  --background: var(--ion-color-tertiary)
}
.menu-background {
  background:url('/src/assets/logo-vivian-simoes-variation.svg');
  height: 100%;
  background-repeat: no-repeat;
  background-position-x: center;
  background-size: 30vh;
}

.tabbar-blur {
  position: sticky;
  /* background: var(--ion-color-background); */
  width: calc(100vw - 20px);
  left: 0;
  right: 0;
  margin: auto;
  height: 60px;
  bottom: -10px;

  background: rgb(255, 252, 246, 0.7);
  backdrop-filter: blur( 16px );
  -webkit-backdrop-filter: blur( 10px)
}

.iconStyle {
  color: rgb(233, 163, 77);
}

</style>