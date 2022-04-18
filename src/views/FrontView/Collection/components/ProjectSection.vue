<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <v-row
        justify="center"
        :class="`elevation-${hover ? 24 : 6}`"
        class="mx-auto pa-3 my-3 transition-swing"
      >
        <v-col cols="4">
          <v-img
            class="mx-auto"
            contain
            :src="
              !value.coverName
                ? require(`@/assets/dt-feu.png`)
                : imgPath('cover', value.coverName)
            "
          ></v-img>
        </v-col>
        <v-col cols="6">
          <v-row cols="12">
            <v-col cols="12">
              <h3>{{ value.projectname }}</h3>
            </v-col>

            <v-col cols="12">
              <div class="subtitle">
                ประเภทโครงงาน:
                <span class="primary--text">{{ value.pTypeName }}</span>
              </div>
            </v-col>

            <v-col cols="12">
              <div class="subtitle">
                ผู้จัดทำ:
                <span class="primary--text">{{ value.fullName }}</span>
              </div>
            </v-col>

            <v-col cols="12" class="mt-3">
              <v-btn
                class="text-uppercase ma-0"
                color="primary"
                label
                @click.stop="
                  $router.push({
                    name: 'ViewCollection',
                    query: { stdId: value.stdId },
                  })
                "
                rounded
                >แสดงรายละเอียด</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-hover>
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
