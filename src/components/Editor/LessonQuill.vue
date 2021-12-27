<template>
  <div class="example">
    <quill-editor
      class="editor"
      ref="myQuillEditor"
      v-model="editorContent"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    />
  </div>
</template>

<script>
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
import ResizeModule from "@botom/quill-resize-module";

Quill.register("modules/ImageExtend", ImageExtend);
Quill.register("modules/resize", ResizeModule);

export default {
  name: "LessonQuill",
  components: {
    quillEditor,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: "img",
            action: `${process.env.VUE_APP_API_PATH}/lesson/uploadImg.php`,
            response: (res) => {
              return `${process.env.VUE_APP_IMG_PATH}/editor/${res.info}`;
            },
            error: (err) => {
              console.log("err", err);
            },
          },
          resize: {
            locale: {},
          },
          toolbar: {
            container: container,
            handlers: {
              image: function () {
                QuillWatch.emit(this.quill.id);
              },
            },
          },
        },
      },
    };
  },
  computed: {
    editorContent: {
      get() {
        return this.content;
      },
      set(val) {
        this.$emit("contentChange", val);
      },
    },
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  methods: {
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
  },
  mounted() {
    console.log("this is current quill instance object", this.editor);
  },
};
</script>

<style lang="scss" scoped>
.example {
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;

  .editor {
    height: 30rem;
    overflow: hidden;
  }
}
</style>
