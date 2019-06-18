<template>
  <div class="home">
    <b-container fluid>
      <form-wizard :start-index="3">
        <tab-content title="Настройки на офертата">
          <b-container>
            <h1>
              За кого ще правим оферта?
            </h1>
            <b-row>
              <b-col>
                <b-form-group label="Име" label-for="firstname" class="text-left">
                  <b-form-input type="text" id="firstname" required v-model="customer.firstname"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Фамилия" label-for="lastname" class="text-left">
                  <b-form-input type="text" id="lastname" required v-model="customer.lastname"></b-form-input>
                </b-form-group>
              </b-col>

            </b-row>
            <b-row>
              <b-col class="text-left">
                Относно цените <br>
                <b-form-radio-group>
                  <b-form-radio id="123" size="lg" v-model="offerRules.onePriceAtLast">Обща цена за всичко, сметната накрая на офертата</b-form-radio>
                  <br>
                  <b-form-radio id="1233" size="lg" v-model="offerRules.separatedPrices">Отделна цена за всичко, което е в офертата (вкл. и допълнителното оборудване)</b-form-radio>
                </b-form-radio-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="text-left">
                <b-form-checkbox id="loan" size="lg" v-model="offerRules.loan">
                  Офертата ще е на разсрочено разплащане
                </b-form-checkbox>
                <b-form-checkbox id="withVAT" size="lg" v-model="offerRules.withVat">
                  Ще въвеждам цените с ДДС?
                </b-form-checkbox>
                <b-form-checkbox id="validity" size="lg" v-model="offerRules.limitedOffer">
                  Офертата ще има валидност
                </b-form-checkbox>
                <b-card bg-variant="info" text-variant="white" v-show="offerRules.limitedOffer">
                  <b-card-text>
                    От
                    <b-form-group>
                      <b-form-select :options="[{ value: '30', text: '30 дни'},{ value: '60', text: '60 дни'},{ value: '90', text: '90 дни'}]">
                      </b-form-select>
                    </b-form-group>
                    Считано от:
                    <b-form-group>
                      <datepicker v-model="offerRules.validFrom" :format="formatDate"></datepicker>
                    </b-form-group>
                  </b-card-text>
                </b-card>
                <b-form-checkbox id="pictures" size="lg" v-model="offerRules.addPicturesWherePersist">
                  Добави снимки на всеки продукт <strong style="color: red;">(КЪДЕТО ИМА!)</strong>
                </b-form-checkbox>

              </b-col>
            </b-row>
          </b-container>
        </tab-content>
        <tab-content title="Изберете Вашия юнит">
          <!--<b-row>-->
           <div>
             <b-card-group v-for="(unit, index1) in units" :key="unit.model" flex>
               <b-card @click="selectUnit(unit)"
                       :bg-variant="selectedUnit === unit ? 'success' : 'Secondary'"
                       :text-variant=" selectedUnit === unit ? 'white' : 'dark'"
               >
                 <div slot="header">
                   <b-card-title>
                     {{ unit.title }} {{ unit.model }}
                   </b-card-title>
                 </div>
                 <b-card-text>
                   <ul v-for="(vx, index) in $_.groupBy(unit.specification, 'section')" :key="index" class="text-left">
                     <h2>{{ index }}</h2>
                     <li v-for="(ti, ind) in vx" :key="ind">
                       {{ ti.title }}
                     </li>
                   </ul>
                 </b-card-text>
               </b-card>
             </b-card-group>
           </div>
          <!--</b-row>-->
        </tab-content>

        <tab-content title="Преглед на спецификацията">
          <b-row>
            <b-col>
              <b-card id="sidebar">
                <div class="so" slot="header">
                  Избрана спецификация за {{ this.selectedUnit.title }} {{ this.selectedUnit.model }}
                </div>
                <b-card-text class="text-left">
                  <ul v-for="(vx, index) in $_.groupBy(this.selectedUnit.specification, 'section')" :key="index" class="text-left">
                    <h2>{{ index }}</h2>
                    <li v-for="(ti, ind) in vx" :key="ind">
                      {{ ti.title }} {{ ti.model }}
                      <ul class="list-group">
                        <li v-for="attribute in ti.attributes" :key="attribute.title"
                            :style="{ 'background-color': (highligtTrigger) ? 'gold' : 'initial' }" >
                          {{ attribute.value }}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </b-card-text>
              </b-card>
            </b-col>

            <b-col>
              <b-card v-if="selectedUnit.model === 'NICEONE'">
                <div slot="header">
                  <h1>
                    Оборудване
                  </h1>
                </div>
                <b-card-body class="text-left">
                  <b-list-group v-for="(vx, index) in $_.groupBy(this.selectedUnit.otherEquipment, 'section')" :key="index">
                    <h2 class="list-group-item active">{{ index }}</h2>
                    <b-list-group-item v-for="item in vx" :key="item.title" class="flex-column align-items-start"
                                       >
                      <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1"> {{ item.title }} {{ item.model }}</h4>
                      </div>
                      <p class="mb-1">
                        <b-img
                             :src="item.images[0].url"
                             style="text-align: left; float: left; margin-right: 10px;"></b-img>
                      </p>
                         <b-btn block @click="addEquipment(item)">ДОБАВИ</b-btn>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-body>
              </b-card>
              <b-card v-else>
                <div class="so" slot="header">
                  Възможни промени по спецификацията на {{ this.selectedUnit.title }} {{ this.selectedUnit.model }}
                </div>
                <div>
                  <div v-for="(vx, index) in $_.groupBy(this.selectedUnit.chairOptions, 'section')" :key="index" class="text-left">
                    <b-card>
                      <div class="dlo" slot="header">
                        <b-card-title>
                          <h2>{{ index ? index : 'zas' }}</h2>
                        </b-card-title>
                      </div>
                        <b-card-body>
                          <div v-if="index === 'Осветителни тела'">
                            <b-form-radio-group size="lg"
                                                id="radio-group-22"
                                                name="radio-sub-component"
                                                v-for="(ti, ind) in vx"
                                                :key="ind">
                              <b-form-radio :value="ti" v-model="lighter" @change="putOption(ti)">
                                {{ ti.title }} {{ ti.model }}
                              </b-form-radio>
                              <ul>
                                <li v-for="attrs in ti.attributes" :key="attrs.value" >
                                  {{ attrs.value}}
                               </li>
                              </ul>
                            </b-form-radio-group>

                          </div>
                          <div v-else>
                            <b-form-group v-for="(ti, ind) in vx" :key="ind" size="lg">
                              <b-form-checkbox size="lg">{{ ti.title }}</b-form-checkbox>
                            </b-form-group>
                          </div>
                        </b-card-body>
                    </b-card>
                  </div>
                </div>
              </b-card>
            </b-col>
          </b-row>
        </tab-content>

        <tab-content title="Избор на допълнително оборудване">
         <b-row>
           <b-col>
             <h2>
               Можем да предложим:
             </h2>
             <table class="table b-table-stacked-lg table-stripped table-bordered">
               <thead>
               <tr>
                 <th style="width: 10px">№</th>
                 <th width="55%">Наименование на изделието</th>
                 <th>Цена за кр. клиент:</th>
               </tr>
               </thead>
               <tbody v-for="(eqq, index) in $_.groupBy(othereq, 'category')">
               <tr>
                 <td colspan="3">{{ index }}</td>
               </tr>
               <tr v-for="xo in eqq">
                 <td>
                 </td>
                 <td>
                   {{ xo.title }} {{ xo.model }}
                   <div v-if="xo.attributes">
                     Спецификация:
                     <ul>
                       <li v-for="attr in xo.attributes">
                         {{ attr.value }}
                       </li>
                     </ul>
                   </div>
                 </td>
                 <td>
                 </td>
               </tr>

               <!--<tr>-->
               <!--<td></td>-->
               <!--<td>-->
               <!--<vue-autosuggest-->
               <!--:suggestions="[{data:othereq}]"-->
               <!--:get-suggestion-value="getSuggestionValue"-->
               <!--v-model="searchOption"-->
               <!--:input-props="{id:'autos', placeholder:'Продукт',class: 'form-control form-control-lg'}"-->
               <!--@input="onInputChange"-->
               <!--@selected="selectHandler"-->
               <!--@click="clickHandler"-->
               <!--&gt;-->
               <!--<template slot-scope="{suggestion}" class="list-group">-->
               <!--<div class="list-group-item">-->
               <!--{{ suggestion.item.title }} <span></span> <strong>{{ suggestion.item.model}}</strong>-->
               <!--<br>-->
               <!--Ед. цена с ДДС: <strong style="color: green;">{{ (suggestion.item.price).toFixed(2) }} лв. </strong><br>-->
               <!--Ед. цена без ДДС: <strong style="color: red;">{{ (suggestion.item.price / 1.2).toFixed(2) }} лв. </strong>-->
               <!--</div>-->

               <!--</template>-->

               <!--</vue-autosuggest>-->
               <!--&lt;!&ndash; Using modifiers &ndash;&gt;-->
               <!--<b-button v-b-modal.my-modal>Show Modal</b-button>-->

               <!--&lt;!&ndash; Using value &ndash;&gt;-->
               <!--<b-button v-b-modal="'my-modal'">Show Modal</b-button>-->

               <!--&lt;!&ndash; The modal &ndash;&gt;-->
               <!--<b-modal id="my-modal">Hello From My Modal!</b-modal>-->
               <!--</td>-->
               <!--<td width="100"><input type="text" class="form-control form-control-lg" v-model="qty"></td>-->
               <!--<td><input type="text" class="form-control form-control-lg" v-model="uprice"></td>-->
               <!--<td><input type="text" class="form-control form-control-lg" v-model="discount"></td>-->
               <!--<td>-->
               <!--{{ this.totalAmountLine }} лв.-->
               <!--</td>-->
               <!--<td>-->
               <!--<b-button class="btn btn-lg btn-success" @click="addEquipment(optionToAdd)">ДОБАВИ</b-button>-->
               <!--</td>-->
               <!--</tr>-->

               </tbody>
             </table>
           </b-col>
           <b-col>
             <table class="table b-table-stacked-lg table-stripped table-bordered">
               <thead>
               <tr>
                 <th style="width: 10px">№</th>
                 <th width="55%">Наименование на изделието</th>
                 <th>Кол.</th>
                 <th>Ед. цена</th>
                 <th>Отстъпка</th>
                 <th>Обща сума с отстъпката</th>
               </tr>
               </thead>
               <tbody>
               <tr v-for="(product, index) in selectedOptionalEquipment" :key="index">
                 <td>
                   {{ index + 1}}
                 </td>
                 <td>
                   {{ product.title }} {{ product.model }}
                 </td>
                 <td>
                   {{ product.qty}}
                 </td>
                 <td>
                   {{ product.unitPrice}}
                 </td>
                 <td></td>
                 <td>
                   {{ product.totalAmountLine}}
                 </td>
               </tr>
               <tr>
                 <td></td>
                 <td>
                   <vue-autosuggest
                     :suggestions="[{data:othereq}]"
                     :get-suggestion-value="getSuggestionValue"
                     v-model="searchOption"
                     :input-props="{id:'autos', placeholder:'Продукт',class: 'form-control form-control-lg'}"
                     @input="onInputChange"
                     @selected="selectHandler"
                     @click="clickHandler"
                   >
                     <template slot-scope="{suggestion}" class="list-group">
                       <div class="list-group-item">
                         {{ suggestion.item.title }} <span></span> <strong>{{ suggestion.item.model}}</strong>
                         <br>
                         Ед. цена с ДДС: <strong style="color: green;">{{ (suggestion.item.price).toFixed(2) }} лв. </strong><br>
                         Ед. цена без ДДС: <strong style="color: red;">{{ (suggestion.item.price / 1.2).toFixed(2) }} лв. </strong>
                       </div>

                     </template>

                   </vue-autosuggest>
                 </td>
                 <td width="100"><input type="text" class="form-control form-control-lg" v-model="qty"></td>
                 <td><input type="text" class="form-control form-control-lg" v-model="uprice"></td>
                 <td><input type="text" class="form-control form-control-lg" v-model="discount"></td>
                 <td>
                   {{ this.totalAmountLine }} лв.
                 </td>
                 <td>
                   <b-button class="btn btn-lg btn-success" @click="addEquipment(optionToAdd)">ДОБАВИ</b-button>
                 </td>
               </tr>

               </tbody>
             </table>
           </b-col>

         </b-row>
        </tab-content>

        <tab-content title="Обобщение">
          <b-card variant="primary" header-variant="primary">
            <div slot="header">
              <h3>
                Обобщението на оферта за {{ customer.firstname }} {{ customer.lastname}}
              </h3>
            </div>
            <b-card-text>
              <pre>
                {{ offerRules }}
              </pre>
              <b-col>
                <span v-if="offerRules.withVat">
                  Цените са с ДДС
                </span>
                <span v-else>
                  Цените са с БЕЗ ДДС
                </span>
                <br>
                <span v-if="offerRules.onePriceAtLast">
                  В офертата ще има една единствена цена изписана най-отдолу на офертата
                </span>
                <br>
                <span v-if="!offerRules.onePriceAtLast">
                  В офертата ще има разбивка на всяка цена!
                </span>
              </b-col>

             <b-row>
               <b-col>
               <span>
                 sosd
               </span><br>
                 {{ (totalAmount).toFixed(2) }} лв. с ДДС</b-col>
               <b-col>{{ (totalAmount / 1.2 ).toFixed(2) }} лв. без ДДС</b-col>
             </b-row>

            </b-card-text>
              <div slot="header">
                <h2>
                  Машина
                </h2>
              </div>
              <b-card-text>
                <b-row>
                  <b-col>
                    <b-card>
                      <div class="so" slot="header">
                        <h2>
                          Финална спецификация {{ this.selectedUnit.title }} {{ this.selectedUnit.model }}
                        </h2>
                      </div>
                      <b-card-text class="text-left">
                        <ul v-for="(vx, index) in $_.groupBy(this.selectedUnit.specification, 'section')" :key="index" class="text-left">
                          <h2>{{ index }}</h2>
                          <li v-for="(ti, ind) in vx" :key="ind">
                            {{ ti.title }} {{ ti.model }}
                            <ul class="list-group">
                              <li v-for="attribute in ti.attributes" :key="attribute.title"
                                  :style="{ 'background-color': (highligtTrigger) ? 'gold' : 'initial' }" >
                                {{ attribute.value }}
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </b-card-text>
                    </b-card>
                  </b-col>
                </b-row>
                <br>
                <b-card header-bg-variant="success">
                  <div slot="header">
                    <h1>
                      Допълнително оборудване
                    </h1>
                  </div>
                  <b-card-text>
                    {{ $_.groupBy(selectedOptionalEquipment, 'category')}}
                  </b-card-text>
                </b-card>
              </b-card-text>
          </b-card>
        </tab-content>
      </form-wizard>
    </b-container>
  </div>

</template>
<style>
  #sidebar.affix-top {
    position: static;
    margin-top:30px;
    width:228px;
  }

  #sidebar.affix {
    position: fixed;
    top:70px;
    width:228px;
  }
  .vdp-datepicker__calendar {
    position: absolute;
    color: #fff;
    z-index: 100;
    background-color: #000;
    width: 300px;
    border: 1px solid #ccc;
  }
  prev {
    background-color: red;
  }
</style>
<script>
  import jsonData from '../dataStore'
  import { VueAutosuggest } from 'vue-autosuggest'
  import 'vue-form-wizard/dist/vue-form-wizard.min.css'
  import Datepicker from 'vuejs-datepicker/src/components/Datepicker'
  import DateInput from 'vuejs-datepicker/src/components/DateInput'

export default {
  name: 'home',
  components: {
    DateInput,
    Datepicker,
    VueAutosuggest
  },
  data () {
    return {
      query: '',
      totalSumOfAdditionalEquipment: '',
      customer: {
        firstname: '',
        lastname: ''
      },
      offerRules: {
        withVat: true,
        onePriceAtLast: false,
        separatedPrices: false,
        loan: false,
        loanPeriod: '',
        limitedOffer: false,
        addPicturesWherePersist: false,
        validFrom: '',
        days: '',
        validUntil: ''
      },
      selected: '',
      searchOption: '',
      units: jsonData.dentalUnits,
      othereq: jsonData.otherEquipment,
      lighter: '',
      options: jsonData.options,
      selectedUnit: '',
      selectedOptionalEquipment: [],
      optionToAdd: '',
      qty: 1,
      discount: 0.00,
      uprice: '',
      totalAmountLine: '',
      grouped: [],
      highligtTrigger: false,
      groupedChairOptions: [],
    }
  },
  mounted () {
    this.units.forEach(unit => {

      this.grouped = this.$_.groupBy(unit.specification, 'section')
      this.groupedChairOptions = this.$_.groupBy(unit.chairOptions, 'section')
    })
  },
  methods: {

    formatDate (date) {
      return moment(date)
    },
    addEquipment (item) {
      this.selectedOptionalEquipment.push({
        title: item.title,
        model: item.model,
        id: item.id,
        qty: this.qty,
        category: item.category,
        unitPrice: this.uprice,
        totalAmountLine: this.qty * this.uprice,
        discount: this.discount
      })
      this.$snotify.success(`${item.title} ${item.model} е добавен към офертата.`, 'Успех')
    },
    selectHandler (item) {
      this.selected = item.item
      this.optionToAdd = item.item
      this.uprice = item.item.price
      this.totalAmountLine = (this.qty * this.uprice)
    },
    clickHandler (item) {
      // event fired when clicking on the input
    },
    onSelected (item) {
      this.selected = item
    },
    onInputChange (text) {
      // event fired when the input changes
      console.log(text)
    },
    /**
     * This is what the <input/> value is set to when you are selecting a suggestion.
     */
    getSuggestionValue (suggestion) {
      return suggestion.item.title + ' ' + suggestion.item.model;
    },
    focusMe (e) {
      console.log(e) // FocusEvent
    },
    putOption (option) {
      console.log(this.selectedUnit);
      this.highligtTrigger = !this.highligtTrigger
      this.selectedUnit.specification[15] = option
      setInterval(() => {
        this.highligtTrigger = false
      }, 1000)
    },
    editRec (index) {

      this.editPost = this.unit[index]

    },
    selectUnit (unit) {
      this.selectedUnit = unit
      this.$store.commit('setUnit', unit)
    }
  },
  computed: {
    totalAmount() {
      let amt = 0
      this.selectedOptionalEquipment.forEach(good => {
        amt += good.totalAmountLine
      })
      return amt
    }
  }
}
</script>
<style scoped>
  @import '~vue-snotify/styles/material.css';

</style>
