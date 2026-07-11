<template>
  <div class="write-editor">
    <!-- 
      The space added to modelValue is a crucial part of the CSS grid auto-grow trick. 
      It prevents trailing newlines from collapsing the height.
    -->
    <div class="grow-wrap" :data-replicated-value="modelValue + ' '">
      <textarea
        class="editor-textarea handwritten"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="readonly ? '' : 'Start writing whenever you\'re ready...'"
        :readonly="readonly"
        autofocus
      ></textarea>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.write-editor {
  width: 100%;
  max-width: 800px;
  padding: 0 var(--space-xl);
}

.grow-wrap {
  display: grid;
  width: 100%;
}

.grow-wrap::after {
  /* This hidden element forces the grid to expand, giving the textarea a 100% height to follow */
  content: attr(data-replicated-value);
  white-space: pre-wrap;
  visibility: hidden;
  grid-area: 1 / 1 / 2 / 2;
  
  /* MUST EXACTLY MATCH THE TEXTAREA TYPOGRAPHY TO GROW CORRECTLY */
  font-family: var(--font-handwritten);
  font-weight: 400;
  font-size: 18px;
  line-height: 1.8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0;
  text-align: center;
  word-wrap: break-word;
}

.editor-textarea {
  grid-area: 1 / 1 / 2 / 2;
  width: 100%;
  height: 100%;
  min-height: 40px;
  border: none;
  background: transparent;
  outline: none;
  color: var(--ink);
  padding: 0;
  text-align: center;
  resize: none;
  overflow: hidden;
}

.editor-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.editor-textarea.handwritten {
  font-family: var(--font-handwritten);
  font-weight: 400;
  font-size: 18px;
  line-height: 1.8;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .write-editor {
    padding: 0 var(--space-lg);
  }

  .editor-textarea.handwritten,
  .grow-wrap::after {
    font-size: 14px;
  }
}
</style>
