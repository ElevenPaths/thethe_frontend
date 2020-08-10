<template>
  <v-flex v-if="resource.response_code === 0" class="font-weight-medium" subheading>
    <v-card>
      <v-card-title>Resource is not in VirusTotal</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <span class="red--text">{{ resource.verbose_msg }}</span>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex v-else-if="resource_type === 'domain'" class="text-xs-left">
    <v-layout wrap>
      <v-flex v-if="resource.domain_siblings.length > 0">
        <v-card>
          <v-card-title class="subheading">
            <v-layout>
              <v-flex xs2>Siblings</v-flex>
              <v-flex xs2>
                <v-chip>{{ domain_siblings_filter_list.length }}</v-chip>
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="filter_siblings"
                  prepend-icon="filter_list"
                  label="Filter"
                  single-line
                  hide-details
                  clearable
                  class="pa-1 ma-0"
                ></v-text-field>
              </v-flex>

              <v-flex xs2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      flat
                      color="grey"
                      v-on="on"
                      @click.stop="
                        copy_content(
                          transform_into_lines(domain_siblings_filter_list)
                        )
                      "
                    >
                      <v-icon>file_copy</v-icon>
                    </v-btn>
                  </template>
                  <span>Copy to clipboard</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex class="scrollable">
              <div v-for="(domain, index) in domain_siblings_filter_list" :key="index">{{ domain }}</div>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex v-if="resource.whois">
        <v-card>
          <v-card-title class="subheading">
            <v-flex>Whois</v-flex>
            <v-spacer></v-spacer>
            <v-flex>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn flat color="grey" v-on="on" @click.stop="copy_content(resource.whois)">
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex>
              <v-textarea rows="14" readonly :value="resource.whois" class="subheading"></v-textarea>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex v-if="resource.https_certificate_date">
        <v-card>
          <v-card-title class="subheading">
            <v-flex>Certificate date</v-flex>
            <v-spacer></v-spacer>
            <v-flex>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="copy_content(resource.https_certificate_date)"
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy UNIX time to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex class="text-xs-center">
              {{
              get_time(resource.https_certificate_date)
              }}
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex v-if="resource.dns_records_date" shrink>
        <v-card>
          <v-card-title class="subheading">
            <v-flex>DNS record date</v-flex>
            <v-spacer></v-spacer>
            <v-flex>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="copy_content(resource.dns_records_date)"
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy UNIX time to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex class="text-xs-center">
              {{
              get_time(resource.dns_records_date)
              }}
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex v-if="resource.undetected_downloaded_samples.length > 0">
        <v-card>
          <v-card-title class="subheading">
            <v-flex>Undetected downloaded samples</v-flex>
            <v-flex>
              <v-chip>
                {{
                resource.undetected_downloaded_samples.length
                }}
              </v-chip>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                      copy_content(
                        resource.undetected_downloaded_samples
                          .map(elem => elem.sha256)
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
            <v-flex>
              <v-card v-for="(item, index) in resource.undetected_downloaded_samples" :key="index">
                <v-card-title>
                  <v-flex>{{ item.sha256 }}</v-flex>
                  <v-flex xs2 text-xs-right>{{ item.date }}</v-flex>
                  <v-flex xs3 text-xs-right>
                    <v-progress-circular
                      :rotate="90"
                      :size="100"
                      :width="15"
                      :value="get_percentage(item.positives, item.total)"
                      :color="get_detection_color(item.positives, item.total)"
                    >
                      <span class="font-weight-bold">
                        {{
                        get_percentage(item.positives, item.total)
                        }}&nbsp;%
                      </span>
                    </v-progress-circular>
                  </v-flex>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex v-if="resource.detected_downloaded_samples.length > 0">
        <v-card>
          <v-card-title class="subheading">
            <v-flex>Detected downloaded samples</v-flex>
            <v-flex>
              <v-chip>{{ resource.detected_downloaded_samples.length }}</v-chip>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                      copy_content(
                        resource.detected_downloaded_samples
                          .map(elem => elem.sha256)
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
            <v-flex>
              <v-card v-for="(item, index) in resource.detected_downloaded_samples" :key="index">
                <v-card-title>
                  <v-flex>{{ item.sha256 }}</v-flex>
                  <v-flex xs2 text-xs-right>{{ item.date }}</v-flex>
                  <v-flex xs3 text-xs-right>
                    <v-progress-circular
                      :rotate="90"
                      :size="100"
                      :width="15"
                      :value="get_percentage(item.positives, item.total)"
                      :color="get_detection_color(item.positives, item.total)"
                    >
                      <span class="font-weight-bold">
                        {{
                        get_percentage(item.positives, item.total)
                        }}&nbsp;%
                      </span>
                    </v-progress-circular>
                  </v-flex>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex v-if="resource.detected_urls.length > 0">
        <v-card>
          <v-card-title class="subheading">
            <v-flex>Detected URLs</v-flex>
            <v-flex>
              <v-chip>{{ resource.detected_urls.length }}</v-chip>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                      copy_content(
                        resource.detected_urls.map(elem => elem.url).join('\n')
                      )
                    "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy URLs to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex>
              <v-card v-for="(item, index) in resource.detected_urls" :key="index">
                <v-card-title>
                  <v-flex text-xs-left>{{ item.url }}</v-flex>
                  <v-flex xs2 text-xs-right>{{ item.scan_date }}</v-flex>
                  <v-flex xs2 text-xs-right>
                    <v-progress-circular
                      :rotate="90"
                      :size="100"
                      :width="15"
                      :value="get_percentage(item.positives, item.total)"
                      :color="get_detection_color(item.positives, item.total)"
                    >
                      <span class="font-weight-bold">
                        {{
                        get_percentage(item.positives, item.total)
                        }}&nbsp;%
                      </span>
                    </v-progress-circular>
                  </v-flex>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex v-if="resource.resolutions.length > 0">
        <v-card>
          <v-card-title class="subheading">
            <v-flex>Resolutions</v-flex>
            <v-flex>
              <v-chip>{{ resource.resolutions.length }}</v-chip>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="grey"
                    v-on="on"
                    @click.stop="
                      copy_content(
                      resource.resolutions.map(elem => elem.ip_address).join('\n')
                      )
                    "
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy IP to clipboard</span>
              </v-tooltip>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex>
              <v-card v-for="(item, index) in resource.resolutions" :key="index">
                <v-card-title>
                  <v-layout align-center justify-center>
                    <v-flex text-xs-left>{{ item.ip_address }}</v-flex>
                    <v-flex text-xs-right>{{ item.last_resolved }}</v-flex>
                  </v-layout>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-flex>

  <v-flex v-else-if="resource_type === 'hash'" class="text-xs-left">
    <v-card>
      <v-card-title class="title">VirusTotal information</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout v-if="resource.scan_date">
          <v-flex lg1>
            <v-label>Scan date</v-label>
          </v-flex>
          <v-flex>{{ resource.scan_date }}</v-flex>
        </v-layout>
        <v-layout v-if="resource.permalink">
          <v-flex lg1>
            <v-label>Link</v-label>
          </v-flex>
          <v-flex>
            <a
              rel="noopener nofollow"
              target="_blank"
              :href="resource.permalink"
            >{{ resource.permalink }}</a>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout v-if="resource.md5">
          <v-flex lg1>
            <v-label>MD5</v-label>
          </v-flex>
          <v-flex>{{ resource.md5 }}</v-flex>
        </v-layout>
        <v-layout v-if="resource.sha1">
          <v-flex lg1>
            <v-label>SHA1</v-label>
          </v-flex>
          <v-flex>{{ resource.sha1 }}</v-flex>
        </v-layout>
        <v-layout v-if="resource.sha256">
          <v-flex lg1>
            <v-label>SHA256</v-label>
          </v-flex>
          <v-flex>{{ resource.sha256 }}</v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="title">Detections</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout v-if="resource.positives">
          <v-flex lg2>
            <v-progress-circular
              :rotate="90"
              :size="100"
              :width="15"
              :value="get_percentage(resource.positives, resource.total)"
              :color="get_detection_color()"
            >
              <span
                class="font-weight-bold"
              >{{ get_percentage(resource.positives, resource.total) }}&nbsp;%</span>
            </v-progress-circular>
          </v-flex>
          <v-flex lg1>
            <v-layout column>
              <v-spacer></v-spacer>
              <v-layout>
                <v-flex lg10>
                  <v-label>Positives</v-label>
                </v-flex>
                <v-flex>{{ resource.positives }}</v-flex>
              </v-layout>
              <v-layout>
                <v-flex lg10>
                  <v-label>Total</v-label>
                </v-flex>
                <v-flex>{{ resource.total }}</v-flex>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>

    <v-card>
      <v-card-title class="title">Scans</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list three-line>
          <v-list-tile v-for="(results, engine, index) in resource.scans" :key="index">
            <v-list-tile-content>
              <v-list-tile-title v-html="engine"></v-list-tile-title>
              <v-list-tile-sub-title>
                <v-layout align-center>
                  <v-flex lg1>
                    <span>Detected</span>
                  </v-flex>
                  <v-flex lg1>
                    <v-chip :color="detected_color(results.detected)">
                      {{
                      results.detected
                      }}
                    </v-chip>
                  </v-flex>
                  <v-flex lg1>
                    <span>Result</span>
                  </v-flex>
                  <v-flex v-if="results.result" lg4>
                    <v-chip>{{ results.result }}</v-chip>
                  </v-flex>
                  <v-flex v-else lg4>
                    <v-chip>-</v-chip>
                  </v-flex>
                  <v-flex lg1 v-if="results.version">
                    <span>Version</span>
                  </v-flex>
                  <v-flex lg2 v-if="results.version">
                    <v-chip>{{ results.version }}</v-chip>
                  </v-flex>
                  <v-flex v-if="results.update">
                    <span>Update</span>
                  </v-flex>
                  <v-flex v-if="results.update">
                    <v-chip>{{ results.update }}</v-chip>
                  </v-flex>
                </v-layout>
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex v-else-if="resource_type === 'url'">
    <v-card>
      <v-card-title class="title">VirusTotal information</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout v-if="resource.scan_date" text-xs-left>
          <v-flex>Scan date</v-flex>
          <v-flex>{{ resource.scan_date }}</v-flex>
          <v-flex v-if="resource.permalink">
            <SecLink :url="resource.permalink" text="link to report"></SecLink>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>

    <v-card>
      <v-card-title class="title">Detections</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout v-if="resource.positives">
          <v-flex lg2>
            <v-progress-circular
              :rotate="90"
              :size="100"
              :width="15"
              :value="get_percentage(resource.positives, resource.total)"
              :color="get_detection_color()"
            >
              <span
                class="font-weight-bold"
              >{{ get_percentage(resource.positives, resource.total) }}&nbsp;%</span>
            </v-progress-circular>
          </v-flex>
          <v-flex lg1>
            <v-layout column>
              <v-spacer></v-spacer>
              <v-layout>
                <v-flex lg10>
                  <v-label>Positives</v-label>
                </v-flex>
                <v-flex>{{ resource.positives }}</v-flex>
              </v-layout>
              <v-layout>
                <v-flex lg10>
                  <v-label>Total</v-label>
                </v-flex>
                <v-flex>{{ resource.total }}</v-flex>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card>
      <v-card-title class="title">Scans</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list three-line>
          <v-list-tile v-for="(results, engine, index) in resource.scans" :key="index">
            <v-list-tile-content>
              <v-list-tile-title v-html="engine"></v-list-tile-title>
              <v-list-tile-sub-title>
                <v-layout align-center>
                  <v-flex xs1>
                    <span>Detected</span>
                  </v-flex>
                  <v-flex xs1>
                    <v-chip :color="detected_color(results.detected)">
                      {{
                      results.detected
                      }}
                    </v-chip>
                  </v-flex>
                  <v-flex xs1>
                    <span>Result</span>
                  </v-flex>
                  <v-flex v-if="results.result" xs4>
                    <v-chip>{{ results.result }}</v-chip>
                  </v-flex>
                  <v-flex v-else xs4>
                    <v-chip>-</v-chip>
                  </v-flex>
                  <v-flex xs1 v-if="results.version">
                    <span>Version</span>
                  </v-flex>
                  <v-flex xs2 v-if="results.version">
                    <v-chip>{{ results.version }}</v-chip>
                  </v-flex>
                  <v-flex v-if="results.update">
                    <span>Update</span>
                  </v-flex>
                  <v-flex v-if="results.update">
                    <v-chip>{{ results.update }}</v-chip>
                  </v-flex>
                  <v-flex v-if="results.detail">
                    <v-chip color="info" outline label text-color="white">
                      <SecLink :url="results.detail">REPORT</SecLink>
                    </v-chip>
                  </v-flex>
                </v-layout>
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex v-else-if="resource_type === 'ip'" class="text-xs-left">
    <v-card>
      <v-card-title class="title">VirusTotal information</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout justify-center wrap>
          <v-flex v-if="resource.whois">
            <v-card>
              <v-card-title class="subheading">
                <v-flex>Whois</v-flex>
                <v-flex v-if="resource.whois_timestamp">
                  <v-chip>{{ new Date(resource.whois_timestamp *1000).toDateString() }}</v-chip>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn flat color="grey" v-on="on" @click.stop="copy_content(resource.whois)">
                        <v-icon>file_copy</v-icon>
                      </v-btn>
                    </template>
                    <span>Copy to clipboard</span>
                  </v-tooltip>
                </v-flex>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-flex>
                  <v-textarea rows="14" readonly :value="resource.whois" class="subheading"></v-textarea>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex v-if="resource.resolutions.length > 0">
            <v-card>
              <v-card-title class="subheading">
                <v-flex>Resolutions</v-flex>
                <v-flex>
                  <v-chip>{{ resource.resolutions.length }}</v-chip>
                </v-flex>
                <v-flex>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        flat
                        color="grey"
                        v-on="on"
                        @click.stop="
                      copy_content(
                      resource.resolutions.map(elem => elem.hostname).join('\n')
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
                <v-flex scrollable>
                  <v-card v-for="(item, index) in resource.resolutions" :key="index">
                    <v-card-title>
                      <v-layout align-center justify-center>
                        <v-flex text-xs-left>{{ item.hostname }}</v-flex>
                        <v-flex text-xs-right>{{ item.last_resolved }}</v-flex>
                      </v-layout>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex v-if="resource.detected_urls.length > 0">
            <v-card>
              <v-card-title class="subheading">
                <v-flex>Detected URLs</v-flex>
                <v-flex>
                  <v-chip>{{ resource.detected_urls.length }}</v-chip>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        flat
                        color="grey"
                        v-on="on"
                        @click.stop="
                      copy_content(
                        resource.detected_urls.map(elem => elem.url).join('\n')
                      )
                    "
                      >
                        <v-icon>file_copy</v-icon>
                      </v-btn>
                    </template>
                    <span>Copy URLs to clipboard</span>
                  </v-tooltip>
                </v-flex>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-flex>
                  <v-card v-for="(item, index) in resource.detected_urls" :key="index">
                    <v-card-title>
                      <v-flex text-xs-left>{{ item.url }}</v-flex>
                      <v-flex xs2 text-xs-right>{{ item.scan_date }}</v-flex>
                      <v-flex xs2 text-xs-right>
                        <v-progress-circular
                          :rotate="90"
                          :size="100"
                          :width="15"
                          :value="get_percentage(item.positives, item.total)"
                          :color="get_detection_color(item.positives, item.total)"
                        >
                          <span class="font-weight-bold">
                            {{
                            get_percentage(item.positives, item.total)
                            }}&nbsp;%
                          </span>
                        </v-progress-circular>
                      </v-flex>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex v-if="resource.undetected_urls.length > 0">
            <v-card>
              <v-card-title class="subheading">
                <v-flex>Undetected URLs</v-flex>
                <v-flex>
                  <v-chip>{{ resource.undetected_urls.length }}</v-chip>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        flat
                        color="grey"
                        v-on="on"
                        @click.stop="
                      copy_content(
                        resource.undetected_urls.map(elem => elem[0]).join('\n')
                      )
                    "
                      >
                        <v-icon>file_copy</v-icon>
                      </v-btn>
                    </template>
                    <span>Copy URLs to clipboard</span>
                  </v-tooltip>
                </v-flex>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-flex>
                  <v-card v-for="(item, index) in resource.undetected_urls" :key="index">
                    <v-card-title v-if="item.length == 5">
                      <v-flex text-xs-left>{{ item[0] }}</v-flex>
                      <v-flex xs12 text-xs-left>{{ item[1] }}</v-flex>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex v-if="resource.undetected_downloaded_samples.length > 0">
            <v-card>
              <v-card-title class="subheading">
                <v-flex>Undetected downloaded samples</v-flex>
                <v-flex>
                  <v-chip>
                    {{
                    resource.undetected_downloaded_samples.length
                    }}
                  </v-chip>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        flat
                        color="grey"
                        v-on="on"
                        @click.stop="
                        copy_content(
                          resource.undetected_downloaded_samples
                            .map(elem => elem.sha256)
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
                <v-flex>
                  <v-card
                    v-for="(item, index) in resource.undetected_downloaded_samples"
                    :key="index"
                  >
                    <v-card-title>
                      <v-flex>{{ item.sha256 }}</v-flex>
                      <v-flex xs2 text-xs-right>{{ item.date }}</v-flex>
                      <v-flex xs3 text-xs-right>
                        <v-progress-circular
                          :rotate="90"
                          :size="100"
                          :width="15"
                          :value="get_percentage(item.positives, item.total)"
                          :color="get_detection_color(item.positives, item.total)"
                        >
                          <span class="font-weight-bold">
                            {{
                            get_percentage(item.positives, item.total)
                            }}&nbsp;%
                          </span>
                        </v-progress-circular>
                      </v-flex>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex v-if="resource.detected_downloaded_samples.length > 0">
            <v-card>
              <v-card-title class="subheading">
                <v-flex>Detected downloaded samples</v-flex>
                <v-flex>
                  <v-chip>{{ resource.detected_downloaded_samples.length }}</v-chip>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        flat
                        color="grey"
                        v-on="on"
                        @click.stop="
                        copy_content(
                          resource.detected_downloaded_samples
                            .map(elem => elem.sha256)
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
                <v-flex>
                  <v-card
                    v-for="(item, index) in resource.detected_downloaded_samples"
                    :key="index"
                  >
                    <v-card-title>
                      <v-flex>{{ item.sha256 }}</v-flex>
                      <v-flex xs2 text-xs-right>{{ item.date }}</v-flex>
                      <v-flex xs3 text-xs-right>
                        <v-progress-circular
                          :rotate="90"
                          :size="100"
                          :width="15"
                          :value="get_percentage(item.positives, item.total)"
                          :color="get_detection_color(item.positives, item.total)"
                        >
                          <span class="font-weight-bold">
                            {{
                            get_percentage(item.positives, item.total)
                            }}&nbsp;%
                          </span>
                        </v-progress-circular>
                      </v-flex>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-card-text>
            </v-card>
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
  name: "virustotal",

  props: {
    plugin_data: Object
  },

  data: function() {
    return { filter_siblings: "", resource_type: null };
  },

  methods: {
    ...mapActions("results", { pushResult: "push" }),
    get_percentage: function(positives, total) {
      if (total == 0) return 0;

      return Math.round((positives / total) * 100);
    },

    get_detection_color: function(positives, total) {
      let percentage = this.get_percentage(positives, total);

      if (percentage === 0) {
        return "green";
      }

      if (percentage > 0 && percentage <= 50) {
        return "yellow";
      }

      if (percentage > 50 && percentage < 70) {
        return "orange";
      }

      return "red";
    },

    detected_color: function(detected) {
      if (detected) {
        return "red";
      } else {
        return "blue";
      }
    },

    copy_content: async function(elem) {
      await navigator.clipboard.writeText(elem);
    },

    transform_into_lines: function(items) {
      return items.join("\n");
    },

    get_time: function(t) {
      return from_python_time(t);
    }
  },
  computed: {
    resource: function() {
      let plugin_result = { ...this.plugin_data.results };
      this.resource_type = this.$store.getters.get_resource_type(
        this.plugin_data.resource_id
      );

      try {
        return JSON.parse(window.atob(window.atob(this.plugin_data.results)));
      } catch {
        return this.plugin_data.results;
      }
    },

    domain_siblings_filter_list: function() {
      let siblings = this.resource.domain_siblings;

      if (!this.filter_siblings) {
        return siblings;
      } else {
        return siblings.filter(elem => {
          return elem.includes(this.filter_siblings);
        });
      }
    }
  },
  beforeMount: function() {
    this.pushResult({
      // This this.$options.name serves to have the plugin name.
      name: this.$options.name,
      result: JSON.stringify(this.resource) || ""
    });
  }
};
</script>

<style scoped>
.scrollable {
  max-height: 500px;
  overflow-y: auto;
}
</style>
