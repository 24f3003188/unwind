<template>
  <div class="write-editor">
    <textarea
      ref="textareaRef"
      class="editor-textarea handwritten"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="readonly ? '' : 'Start writing whenever you\'re ready...'"
      :readonly="readonly"
      autofocus
    ></textarea>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

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

const textareaRef = ref(null)

// Auto-grow textarea
watch(() => props.modelValue, async () => {
  await nextTick()
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
})
</script>

<style scoped>
.write-editor {
  width: 100%;
  max-width: 800px;
  padding: 0 var(--space-xl);
}

.editor-textarea {
  width: 100%;
  min-height: 40px;
  border: none;
  background: transparent;
  outline: none;
  color: var(--ink);
  line-height: 1.7;
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

  .editor-textarea.handwritten {
    font-size: 14px;
  }
}
</style>
