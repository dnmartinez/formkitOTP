<script setup lang="ts">
import { ref } from "vue";
import { FormKitFrameworkContext } from "@formkit/core";

interface PropType extends FormKitFrameworkContext {
  digits: number;
}

const props = defineProps<{ context: PropType }>();

const digits = Number(props.context.digits);
const tmp = ref((props.context.value as string) || "");
let arr = Array(digits)

/**
 * Handle input, advancing or retreating focus.
 */

function handleInput(index: number, e: Event) {
  if (e.inputType == 'insertFromPaste') {
    return
  }
  if (e.inputType === 'deleteContentBackward') {
    return
  }
  const inputs = (e.target as HTMLInputElement).parentElement.querySelectorAll(
    "input"
  );
  if(arr[index] == null) {
    arr[index] = e.data
  }
  if (index < digits - 1 && (!arr[index + 1])) {
    // If this is a new input and not at the end, focus the next input
    inputs.item(index + 1).focus()
  }
  if (arr.toString().replaceAll(',', '').length === digits) {
    props.context.node.input(arr.toString().replaceAll(',', ''))
  }
}

/**
 * On focus, select the text in our input.
 */
function handleFocus(e: FocusEvent) {
  (e.target as HTMLInputElement).select();
}

/**
 * Handle the paste event.
 */
function handlePaste(e: ClipboardEvent) {
  const paste = e.clipboardData.getData("text");
  if (typeof paste === "string") {
    // If it is the right length, paste it.
    //tmp.value = paste.substring(0, digits);
    const inputs = document.querySelectorAll('.opt-digit')
    // Focus on the last character
    inputs.forEach((element, index) => {
      element.setAttribute("value", paste[index]);
      arr[index] = paste[index]
      
    });
    props.context.node.input(arr.toString().replaceAll(',', ''))
  }
}

function handleDeleteInput(index, e) {
  const inputs = e.target.parentElement.querySelectorAll('input')
  if(index < 0) {
    return
  }
  if (e.code === 'Backspace') {
    arr[index] = null
    inputs.item(index - 1).focus()
    return
  }
}
</script>

<template>
  <input v-for="index in digits"
         maxlength="1"
         type="text"
         :class="context.classes.digit"
         class="opt-digit"
         :value="arr[index - 1]"
         @input="handleInput(index - 1, $event)"
         @keyup.delete="handleDeleteInput(index - 1, $event)"
         @focus="handleFocus($event)"
         @paste="handlePaste" />
</template>