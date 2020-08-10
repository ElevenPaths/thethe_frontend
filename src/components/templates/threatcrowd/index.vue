<template>
  <v-flex v-if="resource.response_code === '0'">
    <v-card>
      <v-card-text>
        <v-flex title class="red--text">There is no info of this resource in ThreatCrowd</v-flex>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex v-else-if="resource_type === 'email'">
    <v-card v-if="resource.domains.length > 0">
      <v-card-title>
        <v-flex text-xs-left class="font-weight-bold">Domains</v-flex>
        <v-flex text-xs-right>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                flat
                color="grey"
                v-on="on"
                @click.stop="
                      copy_content(
                        resource.domains
                          .map(elem => elem)
                          .join('\n')
                      )
                    "
              >
                <v-icon>file_copy</v-icon>
              </v-btn>
            </template>
            <span>Copy domains to clipboard</span>
          </v-tooltip>
        </v-flex>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-flex text-xs-left v-for="(domain, index) in resource.domains" :key="index">{{ domain }}</v-flex>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card v-if="resource.references.length > 0">
      <v-card-title>
        <v-flex text-xs-left class="font-weight-bold">References</v-flex>
        <v-flex text-xs-right>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                flat
                color="grey"
                v-on="on"
                @click.stop="
                      copy_content(
                        resource.references
                          .map(elem => elem)
                          .join('\n')
                      )
                    "
              >
                <v-icon>file_copy</v-icon>
              </v-btn>
            </template>
            <span>Copy references to clipboard</span>
          </v-tooltip>
        </v-flex>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-flex
          text-xs-left
          v-for="(reference, index) in resource.references"
          :key="index"
        >{{ reference }}</v-flex>
      </v-card-text>
      <v-card-text>{{ resource }}</v-card-text>
    </v-card>
    <v-card v-if="resource.permalink">
      <v-card-text>
        <v-layout row text-xs-left>
          <v-flex xs1>Report:</v-flex>
          <v-flex>
            <SecLink :url="resource.permalink" :text="resource.permalink"></SecLink>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex v-else-if="resource_type === 'domain'">
    <v-layout>
      <v-flex>
        <v-card v-if="resource.resolutions.length > 0">
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold">Resolutions</v-flex>
            <v-flex>
              <v-chip>{{ resource.resolutions.length }}</v-chip>
            </v-flex>
            <v-flex text-xs-right>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                              copy_content(
                                resource.resolutions
                                  .map(elem => elem.ip_address)
                                  .join('\n')
                              )
                            "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy ip addresses to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-for="(resolution, index) in resource.resolutions" :key="index">
            <v-layout>
              <v-flex text-xs-left>{{ resolution.ip_address }}</v-flex>
              <v-flex text-xs-right>{{ resolution.last_resolved }}</v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card v-if="resource.subdomains.length > 0">
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold">Subdomains</v-flex>
            <v-flex>
              <v-chip>{{ resource.subdomains.length }}</v-chip>
            </v-flex>
            <v-flex text-xs-right>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                              copy_content(
                                resource.subdomains
                                  .map(elem => elem)
                                  .join('\n')
                              )
                            "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy subdomains to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex
              text-xs-left
              v-for="(subdomain, index) in resource.subdomains"
              :key="index"
            >{{ subdomain }}</v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex>
        <v-card v-if="resource.emails.length > 0">
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold">Emails</v-flex>
            <v-flex>
              <v-chip>{{ resource.emails.length }}</v-chip>
            </v-flex>
            <v-flex text-xs-right>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                              copy_content(
                                resource.emails
                                  .map(elem => elem)
                                  .join('\n')
                              )
                            "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy emails to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-for="(email, index) in resource.emails" :key="index">
            <v-layout>
              <v-flex text-xs-left>{{ email }}</v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card v-if="resource.hashes.length > 0">
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold">Hashes</v-flex>
            <v-flex>
              <v-chip>{{ resource.hashes.length }}</v-chip>
            </v-flex>
            <v-flex text-xs-right>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                              copy_content(
                                resource.hashes
                                  .map(elem => elem)
                                  .join('\n')
                              )
                            "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy hashes to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex text-xs-left v-for="(hash, index) in resource.hashes" :key="index">{{ hash }}</v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-card v-if="resource.references.length > 0">
      <v-card-title>
        <v-flex text-xs-left class="font-weight-bold">References</v-flex>
        <v-flex text-xs-right>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                flat
                color="grey"
                v-on="on"
                @click.stop="
                      copy_content(
                        resource.references
                          .map(elem => elem)
                          .join('\n')
                      )
                    "
              >
                <v-icon>file_copy</v-icon>
              </v-btn>
            </template>
            <span>Copy references to clipboard</span>
          </v-tooltip>
        </v-flex>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-for="(reference, index) in resource.references" :key="index">
        <v-flex text-xs-left>{{ reference }}</v-flex>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>

    <v-card v-if="resource.permalink">
      <v-card-text>
        <v-layout row text-xs-left align-center>
          <v-flex xs1 class="font-weight-bold">Report:</v-flex>
          <v-flex>
            <SecLink :url="resource.permalink" :text="resource.permalink"></SecLink>
          </v-flex>
          <v-flex xs1 class="font-weight-bold">Votes:</v-flex>
          <v-flex>
            <v-chip>{{ resource.votes }}</v-chip>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex v-else-if="resource_type === 'ip'">
    <v-layout>
      <v-flex>
        <v-card v-if="resource.resolutions.length > 0">
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold">Resolutions</v-flex>
            <v-flex>
              <v-chip>{{ resource.resolutions.length }}</v-chip>
            </v-flex>
            <v-flex text-xs-right>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                              copy_content(
                                resource.resolutions
                                  .map(elem => elem.ip_address)
                                  .join('\n')
                              )
                            "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy domains to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-for="(resolution, index) in resource.resolutions" :key="index">
            <v-layout>
              <v-flex text-xs-left>{{ resolution.domain }}</v-flex>
              <v-flex text-xs-right>{{ resolution.last_resolved }}</v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card v-if="resource.hashes.length > 0">
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold">Hashes</v-flex>
            <v-flex>
              <v-chip>{{ resource.hashes.length }}</v-chip>
            </v-flex>
            <v-flex text-xs-right>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                              copy_content(
                                resource.hashes
                                  .map(elem => elem)
                                  .join('\n')
                              )
                            "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy hashes to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex text-xs-left v-for="(hash, index) in resource.hashes" :key="index">{{ hash }}</v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-card v-if="resource.references.length > 0">
      <v-card-title>
        <v-flex text-xs-left class="font-weight-bold">References</v-flex>
        <v-flex text-xs-right>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                flat
                color="grey"
                v-on="on"
                @click.stop="
                      copy_content(
                        resource.references
                          .map(elem => elem)
                          .join('\n')
                      )
                    "
              >
                <v-icon>file_copy</v-icon>
              </v-btn>
            </template>
            <span>Copy references to clipboard</span>
          </v-tooltip>
        </v-flex>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-for="(reference, index) in resource.references" :key="index">
        <v-flex text-xs-left>{{ reference }}</v-flex>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>

    <v-card v-if="resource.permalink">
      <v-card-text>
        <v-layout row text-xs-left align-center>
          <v-flex xs1 class="font-weight-bold">Report:</v-flex>
          <v-flex>
            <SecLink :url="resource.permalink" :text="resource.permalink"></SecLink>
          </v-flex>
          <v-flex xs1 class="font-weight-bold">Votes:</v-flex>
          <v-flex>
            <v-chip>{{ resource.votes }}</v-chip>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex v-else-if="resource_type === 'hash'">
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold">Alternative forms</v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout text-xs-left>
              <v-flex xs1 class="font-weight-bold">MD5</v-flex>
              <v-flex>{{ resource.md5 }}</v-flex>
            </v-layout>
            <v-layout text-xs-left>
              <v-flex xs1 class="font-weight-bold">SHA1</v-flex>
              <v-flex>{{ resource.sha1 }}</v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex>
        <v-card v-if="resource.scans.length > 0">
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold">Scans</v-flex>
            <v-flex>
              <v-chip>{{ resource.scans.length }}</v-chip>
            </v-flex>
            <v-flex text-xs-right>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                              copy_content(
                                resource.scans
                                  .map(elem => elem)
                                  .join('\n')
                              )
                            "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy scans names to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-for="(scan, index) in resource.scans" :key="index">
            <v-layout>
              <v-flex text-xs-left>{{ scan }}</v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card v-if="resource.domains.length > 0">
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold">Domains</v-flex>
            <v-flex>
              <v-chip>{{ resource.domains.length }}</v-chip>
            </v-flex>
            <v-flex text-xs-right>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                              copy_content(
                                resource.domains
                                  .map(elem => elem)
                                  .join('\n')
                              )
                            "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy domains to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex
              text-xs-left
              v-for="(domain, index) in resource.domains"
              :key="index"
            >{{ domain }}</v-flex>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card v-if="resource.ips.length > 0">
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold">IP</v-flex>
            <v-flex>
              <v-chip>{{ resource.ips.length }}</v-chip>
            </v-flex>
            <v-flex text-xs-right>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                              copy_content(
                                resource.ips
                                  .map(elem => elem)
                                  .join('\n')
                              )
                            "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy ip addresses to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex text-xs-left v-for="(ip, index) in resource.ips" :key="index">{{ ip }}</v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-card v-if="resource.references.length > 0">
      <v-card-title>
        <v-flex text-xs-left class="font-weight-bold">References</v-flex>
        <v-flex text-xs-right>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                flat
                color="grey"
                v-on="on"
                @click.stop="
                      copy_content(
                        resource.references
                          .map(elem => elem)
                          .join('\n')
                      )
                    "
              >
                <v-icon>file_copy</v-icon>
              </v-btn>
            </template>
            <span>Copy references to clipboard</span>
          </v-tooltip>
        </v-flex>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-for="(reference, index) in resource.references" :key="index">
        <v-flex text-xs-left>{{ reference }}</v-flex>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>

    <v-card v-if="resource.permalink">
      <v-card-text>
        <v-layout row text-xs-left align-center>
          <v-flex xs1 class="font-weight-bold">Report:</v-flex>
          <v-flex>
            <SecLink :url="resource.permalink" :text="resource.permalink"></SecLink>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { make_unique_list, from_python_time } from "../../../utils/utils";
import SecLink from "../../SecLink";
import { mapActions } from "vuex";

export default {
  name: "threatcrowd",
  components: { SecLink },

  props: {
    plugin_data: Object
  },
  data: function() {
    return {
      resource_type: null
    };
  },
  computed: {
    resource: function() {
      let plugin_result = this.plugin_data.results;
      this.resource_type = this.$store.getters.get_resource_type(
        this.plugin_data.resource_id
      );
      return plugin_result;
    }
  },
  methods: {
    ...mapActions("results", { pushResult: "push" }),
    formatted_time: function(ts) {
      let t = new Date(ts);
      return `${t.toLocaleDateString()} at ${t.toLocaleTimeString()}`;
    },
    copy_content: async function(data) {
      await navigator.clipboard.writeText(data);
    }
  },
  beforeMount: function() {
    this.pushResult({
      // This this.$options.name serves to have the plugin name.
      name: this.$options.name,
      result: JSON.stringify(this.plugin_data.results) || ""
    });
  }
};
</script>
