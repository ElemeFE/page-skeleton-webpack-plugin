<template>
  <div class="edit-panel">
    <div ref="editor"></div>
  </div>
</template>

<script>
  import codeMirror from '../codeMirror'
  import bus from '../bus'

  export default {
    data () {
      return {
        editor: null
      }
    },
    props: {
      shellHtml: {
        type: String,
        required: true
      }
    },
    created() {
      this.$nextTick(() => {
        const { shellHtml } = this
        const container = this.$refs.editor
        const codeMirrorConfig = {
          value: shellHtml,
          lineNumbers: true,
          autofocus: true,
          lineWrapping: true,
          styleActiveLine: true
        }
        const editor = this.editor = codeMirror(container, codeMirrorConfig)
        editor.on('change', (cm, change) => {
          const value = cm.getValue()
          this.$store.dispatch('SAVE_CODE', value)
        })
        bus.$on('set-code', this.setCode)
      })
    },
    beforeDestroy() {
      bus.$off('set-code', this.setCode)
    },
    methods: {
      setCode (code) {
        const { editor } = this
        if (editor) editor.setValue(code)
      }
    }
  }
</script>

<style scoped>
</style>