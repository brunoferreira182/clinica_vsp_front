import { createRouter, createWebHistory, createWebHashHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue'
import TabsLayout from '../layouts/TabsLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MainLayout,
    children: [
      // { path: '/', redirect: '/login' },
      {
        path: '/tabs',
        component: TabsLayout,
        children: [
          { path: '/tabs/home', component: () => import('@/views/Home.vue') },
          { path: '/tabs/messengerChat', component: () => import('@/views/MessengerChat.vue') },
          { path: '/myProfile', component: () => import('@/views/MyProfile.vue') },
          { path: '/newDraftCompanyBody', component: () => import('@/views/NewDraftCompanyBody.vue') },
        ]
      },
      { path: '/newDraftProcedureSelection', component: () => import('@/views/NewDraftProcedureSelection.vue') },
      { path: '/newDraftComplaintSelection', component: () => import('@/views/NewDraftComplaintSelection.vue') },
      { path: '/newDraftProceduresList', component: () => import('@/views/NewDraftProceduresList.vue') },
      { path: '/newDraftComplaintsList', component: () => import('@/views/NewDraftComplaintsList.vue') },
      { path: '/newDraftProcedureDetail', component: () => import('@/views/NewDraftProcedureDetail.vue') },
      { path: '/newOrEditOpportunityBudget', component: () => import('@/views/NewOrEditOpportunityBudget.vue') },
      { path: '/newOpportunityInsertPhoto', component: () => import('@/views//NewOpportunityInsertPhoto.vue') },
      { path: '/newOpportunityBeforeCheckout', component: () => import('@/views//NewOpportunityBeforeCheckout.vue') },
      { path: '/newOpportunityCheckout', component: () => import('@/views//NewOpportunityCheckout.vue') },
      { path: '/newOpportunityConfirmPayment', component: () => import('@/views//NewOpportunityConfirmPayment.vue') },
      { path: '/newOpportunitySchedule', component: () => import('@/views//NewOpportunitySchedule.vue') },
      { path: '/newOpportunityDetail', component: () => import('@/views//NewOpportunityDetail.vue') },
      { path: '/newOpportunitiesApprovedList', component: () => import('@/views//NewOpportunitiesApprovedList.vue') },
      { path: '/newOpportunityPaymentSuccess', component: () => import('@/views//NewOpportunityPaymentSuccess.vue') },
      { path: '/invoiceDetail', component: () => import('@/views/InvoiceDetail.vue') },
      { path: '/postDetail', component: () => import('@/views/PostDetail.vue') },
      { path: '/postComments', component: () => import('@/views/PostComments.vue') },
      { path: '/postReactions', component: () => import('@/views/PostReactions.vue') },
      { path: '/newPost', component: () => import('@/views/NewPost.vue') },
      { path: '/editProfile', component: () => import('@/views/EditProfile.vue') },
      { path: '/userProfile', component: () => import('@/views/UserProfile.vue') },
      { path: '/register', component: () => import('@/views/Register.vue') },
      { path: '/login', component: () => import('@/views/Login.vue') },
      { path: '/guestInfo', component: () => import('@/views/GuestInfo.vue') },
      { path: '/loading', component: () => import('@/views/Loading.vue') },
      { path: '/paymentProcedureCheckout', component: () => import('@/views/PaymentProcedureCheckout.vue') },
      { path: '/paidProceduresOpportunities', component: () => import('@/views/PaidProceduresOpportunities.vue') },
      { path: '/messengerChat', component: () => import('@/views/MessengerChat.vue') },
      { path: '/notifications', component: () => import('@/views/Notifications.vue') },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
