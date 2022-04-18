<template>
  <v-col cols="12" :md="size === 2 ? 6 : size === 3 ? 4 : undefined">
    <base-card height="150" color="grey lighten-1" dark>
      <!-- <v-img
        class="mx-auto"
        contain
        max-height="500"
        max-width="500"
        :src="imgPath('cover', value.coverName)"
      ></v-img> -->

      <v-img
        contain
        :src="
          !value.coverName
            ? require(`@/assets/dt-feu.png`)
            : imgPath('cover', value.coverName)
        "
        height="300"
        gradient="rgba(0, 0, 0, .42), rgba(0, 0, 0, .42)"
      >
        <v-row class="fill-height text-right ma-0">
          <v-col cols="12">
            <v-chip
              label
              class="mx-0 mb-2 text-uppercase"
              color="grey darken-3"
              text-color="white"
              small
              @click.stop=""
            >
              {{ value.fullName }}
            </v-chip>

            <h3 class="title white--text font-weight-bold mb-2">
              {{ value.projectname }}
            </h3>
          </v-col>

          <v-col align-self="end">
            <v-chip
              class="text-uppercase ma-0"
              color="primary"
              label
              @click.stop="
                $router.push({
                  name: 'ViewCollection',
                  query: { stdId: value.stdId },
                })
              "
            >
              ดูเพิ่มเติม
            </v-chip>
          </v-col>
        </v-row>
      </v-img>
    </base-card>
  </v-col>
</template>

<script>
export default {
  name: "FeedCard",
  props: {
    size: {
      type: Number,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style>
.v-image__image {
  transition: 0.3s linear;
}
</style>
