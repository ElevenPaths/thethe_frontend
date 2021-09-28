<template>
  <v-layout row pt-2 wrap class="subheading">
    <v-flex>
      <v-flex v-if="resource.result_status[0] != 1">
          <v-card>
            <v-card-text>
              <v-flex title class="blue--text">There is no info of this resource in Opswat Metadefender</v-flex>
            </v-card-text>
          </v-card>
      </v-flex> 
    </v-flex>


      <v-flex  v-if="resource.result_status[0] == 1"> 
        <v-card v-if="resource.results.scan_results.scan_all_result_a == 'Infected'">
          <v-card>
            <v-card-text>
              <v-flex title class="red--text">Infected</v-flex>
            </v-card-text>
          
            <v-card-title primary-title>
              <span class="subheading">FileInfo</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-layout row>
                <v-flex lg-6 class="text-xs-left">
                  <v-layout column>
                    <v-flex><v-label>Filesize:</v-label></v-flex>
                    <v-flex><v-label>MD5:</v-label></v-flex>
                    <v-flex><v-label>sha1:</v-label></v-flex>
                    <v-flex><v-label>SHA1:</v-label></v-flex>
                    <v-flex><v-label>SHA256:</v-label></v-flex>
                    <v-flex><v-label>Description:</v-label></v-flex>
                    <v-flex><v-label>Extension:</v-label></v-flex>
                    <v-flex><v-label>Display name:</v-label></v-flex>
                  </v-layout>
                </v-flex>
                <v-flex lg-6 class="text-xs-right">
                  <v-layout column>
                    <v-flex>{{resource.results.file_info.file_size}}</v-flex>
                     <v-flex>{{resource.results.file_info.md5}}</v-flex>
                     <v-flex>{{resource.results.file_info.sha1}}</v-flex>
                     <v-flex>{{resource.results.file_info.sha256}}</v-flex>
                     <v-flex>{{resource.results.file_info.file_type_description}}</v-flex>
                     <v-flex>{{resource.results.file_info.file_type_extension}}</v-flex>
                     <v-flex>{{resource.results.file_info.display_name}}</v-flex>
                    <!-- <v-flex>asdgasdgas</v-flex> -->
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
            <v-layout wrap>
               <the-opswat-descriptor :items="resource.results.scan_results.scan_details" title="Results"></the-opswat-descriptor>
            </v-layout>
        </v-card> 
      

        <v-card v-if="resource.results.scan_results.scan_all_result_a != 'Infected'">
            <v-card-text>
              <v-flex title class="green--text">No Threat Detected</v-flex>
            </v-card-text>
            <v-card-title primary-title>
              <span class="subheading">FileInfo</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-layout row>
                <v-flex lg-6 class="text-xs-left">
                  <v-layout column>
                    <v-flex><v-label>Filesize:</v-label></v-flex>
                    <v-flex><v-label>MD5:</v-label></v-flex>
                    
                  </v-layout>
                </v-flex>
                <v-flex lg-6 class="text-xs-right">
                  <v-layout column>
                    <v-flex>{{resource.results.file_info.file_size}}</v-flex>
                     <v-flex>{{resource.results.file_info.md5}}</v-flex>
                    <!-- <v-flex>asdgasdgas</v-flex> -->
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
        </v-card>
</v-flex>

  </v-layout>
</template>

<script>
import { make_unique_list, from_python_time } from "../../../utils/utils";
import { mapActions } from "vuex";
import TheOpswatDescriptor from "../../TheOpswatDescriptor";

export default {
  name: "opswat",
  props: {
    plugin_data: Object
  },
  components: {
    TheOpswatDescriptor
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
         result: this.plugin_data.results   || "" 
       });
     }
   },
  beforeMount: function() {
    this.pushResult({
      // This this.$options.name serves to have the plugin name.
      name: this.$options.name,
      result: this.plugin_data.results || ""
      
    });
    //console.log(`Error: template for plugin "${this.plugin_data.results}" not found`)
  }
};
</script>
