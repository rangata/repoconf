<template>
  <div class="hello">
    <div class="row">
      <div class="col-md-2 col-xs-2">
        <div v-for="facet in searchResult.data.aggregations">
          <h5 style="margin-bottom: 5px;"><strong style="color: #337ab7;">{{ facet.title }}</strong></h5>

          <ul class="browse-list list-unstyled long-list" style="margin-bottom: 0;">
            <li v-for="bucket in facet.buckets">
              <div class="checkbox block" style="margin-top: 0; margin-bottom: 0;">
                <label>
                  <!--<input class="checkbox" type="checkbox" v-on:click="updateFilters(facet.name, bucket.key)" v-model="filters[bucket.key]" value="{{ bucket.key }}" v-bind:value="isChecked2()">-->
                  <!--<input class="checkbox" type="checkbox" v-on:click="updateFilters(facet.name, bucket.key)" v-model="filters[bucket.key]" v-bind:value="bucket.key">-->
                  <input class="checkbox" type="checkbox" v-model="filters[facet.name]" v-bind:value="bucket.key">
                  {{ bucket.key }} ({{ bucket.doc_count }})
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-md-10 col-xs-10">
        <div class="breadcrumbs"></div>
        <div class="clearfix"></div>
        <!--<h3>List of items ({{ searchResult.pagination.total }})</h3>-->
        <table class="table table-striped">
          <tbody>
          <tr v-for="item of searchResult.data.items">
            <td><img style="width: 100px;" v-bind:src="item.image"></td>
            <td></td>
            <td>
              <b>{{ item.name }}</b>
              <br />
              {{ item.description }}
            </td>
            <td></td>
            <td>
              <span style="font-size: 12px; display: block; float: left; background-color: #dbebf2; border-radius: 5px; padding: 1px 3px 1px 3px; margin: 2px;" v-for="tag in item.tags">{{ tag }}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="clearfix"></div>
      </div>

      <div class="clearfix" style="margin-bottom: 100px;"></div>
    </div>
  </div>
</template>

<script>
import data from '../../data'


export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      items: data
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
