<template>
  <v-layout row pt-2 wrap class="subheading">
    <v-flex>
      <v-flex lg6>
        <v-card>
          <v-card-title primary-title>
            <span class="subheading">Hashdd Plugin</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout row>
              <v-flex lg-6 class="text-xs-left">
                <v-layout column>
                  <v-flex><v-label>Message:</v-label></v-flex>
                  <v-flex><v-label>Hash:</v-label></v-flex>
                  <v-flex ><v-label>Knownlevel:</v-label></v-flex>
                </v-layout>
              </v-flex>
              <v-flex lg-6 class="text-xs-right">
                <v-layout column>
                  <v-flex>{{ resource.results.search_results[0].result }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].hash }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].knownlevel }}</v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>    
      <v-flex lg7 >
        <v-card v-if="resource.results.search_results[0].details != null">
          <v-card-title primary-title>
            <span class="subheading">Hashdd Details</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout row>
              <v-flex lg-6 class="text-xs-left">
                <v-layout column>
                  <v-flex><v-label>Data source:</v-label></v-flex>
                  <v-flex><v-label>nsrl version:</v-label></v-flex>
                  <v-flex ><v-label>MD5:</v-label></v-flex>
                  <v-flex ><v-label>SHA1:</v-label></v-flex>
                  <v-flex ><v-label>CRC32:</v-label></v-flex>
                  <v-flex ><v-label>File name:</v-label></v-flex>
                  <v-flex ><v-label>Size:</v-label></v-flex>
                  <v-flex ><v-label>Product Code :</v-label></v-flex>
                  <v-flex ><v-label>OP system code:</v-label></v-flex>
                  <v-flex ><v-label>Product name:</v-label></v-flex>
                  <v-flex ><v-label>Product version:</v-label></v-flex>
                  <v-flex ><v-label>Product manufacturer:</v-label></v-flex>
                </v-layout>
              </v-flex>
              <v-flex lg-6 class="text-xs-right">
                <v-layout column>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_data_source }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.nsrl_version }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_md5 }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_sha1 }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_crc32 }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_file_name }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_size }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_product_code }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_opsystem_code }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_product_name }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_product_version }}</v-flex>
                  <v-flex>{{ resource.results.search_results[0].details.hashdd_product_manufacturer }}</v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
    </v-flex>
  </v-flex>

  </v-layout>
</template>

<script>
import { make_unique_list, from_python_time } from "../../../utils/utils";
import { mapActions } from "vuex";

export default {
  name: "hashdd",
  props: {
    plugin_data: Object
  },
  data: function() {
    return {};
  },
  methods: {
    ...mapActions("results", { pushResult: "push" })
  },
  computed: {
    //...mapState("results", { scan: "ready" }),
    resource: function() {
      let plugin_result = { ...this.plugin_data };
      //plugin_result.ptr = make_unique_list(plugin_result.ptr);

      return plugin_result;
    }
  },
  watch: {
     scan: function(n, o) {
       this.pushResult({
         // This this.$options.name serves to have the plugin name.
         name: this.$options.name,
         result: this.plugin_data.results.result   || "" 
       });
     }
   },
  beforeMount: function() {
    this.pushResult({
      // This this.$options.name serves to have the plugin name.
      name: this.$options.name,
      result: this.plugin_data.results.result || ""
      
    });
    //console.log(`Error: template for plugin "${this.plugin_data.results}" not found`)
  }
};
</script>
