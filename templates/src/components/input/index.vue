<template>
  <div :class="$style.content">
    <template v-if="title">
      <div :class="[$style.row, $style['ver-c']]">
        <p v-if="important" :class="$style['b-important']">* &nbsp;</p>
        <p v-else>{{ '' }}</p>
        <span>{{ title }}{{ subTitle }}</span>
      </div>
      <div :class="$style.dh10"></div>
    </template>
    <input
      :placeholder="placeholder || `请输入${title}`"
      @change="changeContent"
      :maxlength="maxLength"
      :type="inputType || ''"
      @blur="changeBlur"
      v-model="inputContent"
      :disabled="disabled"
      @input="onInputCoding"
      :class="className"
    />
    <div v-if="showRule" :class="[ getSystem() === 'windows' ? `${$style['error-number-box']} ` : $style['error-number-box']]">
      <span
        v-if="important && showWarn"
        :class="$style['b-important']"
      >{{ showWarnText || warnText || `${title}必填` }}</span>
      <span v-if="!showWarn && important" style="color: transparent;">必填项</span>
      <span style="color: #d9d9d9;" v-if="showNumber">{{ inputContent?.length || 0 }}/{{ maxLength }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup="">
import { ref, PropType, watch } from 'vue'
import { getSystem } from '@/utils/utils';
const props = defineProps({
  content: String,
  title: String,
  subTitle: String,
  important: Boolean,
  warnText: String,
  regWarnText: String,
  blackWarnText: String,
  placeholder: String,
  maxLength: {type:Number,default: 20},
  inputType: String,
  change: Function,
  reg: Array as PropType<RegExp[]>,
  warnChange: Function,
  checkTimes: Number,
  showNumber: Boolean,
  allowCode: Boolean,
  strict: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  blackList: { type: Array as PropType<String[]>, default: [] },
  showRule: { type: Boolean, default: true },
  className: String
})
const inputContent = ref(props.content)
watch(() => props.checkTimes, (times, preTimes) => {
  if (times && times > 0) checkContent();
});
watch(() => props.content, (str, preStr) => {
  inputContent.value = str;
});
const showWarn = ref(false);
const showWarnText = ref('');
const updateEmit = defineEmits(["update:content", 'change']);
const emojiRex = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g;
const specialCode = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");

const changeContent = ($event: Event) => {
  checkContent();
  //@ts-ignore
  updateEmit('update:content', $event.target.value.trim());
  //@ts-ignore
  props.change && props.change($event.target.value.trim());
}
const changeBlur = () => {
  checkContent()
}
const onInputCoding = (event: Event) => {
  if(props.inputType==='number') {
    //@ts-ignore
    const number = event.target.value
    const limitLength = props.maxLength;
    if(number>=limitLength) {
      const tempnumber = `${number}`.substring(0,limitLength);
      inputContent.value = tempnumber;
    }
  }
}
const checkContent = () => {
  showWarnText.value = '';
  showWarn.value = false;
  if (!props.important) return;
  if(props.blackList && props.blackList.length && props.content && checkBlcakList(props.content, props.blackList)) {
    // @ts-ignore
    showWarnText.value = props.blackWarnText;
    showWarn.value = true;
  } else if (props.content && props.reg && !checkReg(props.reg, props.content,)) {
    // @ts-ignore
    showWarnText.value = props.regWarnText;
    showWarn.value = true;
  } else if (props.content && props.strict && (emojiRex.test(props.content) || specialCode.test(props.content))) {
    showWarnText.value = '内容不能包含特殊符号，emoji表情';
    showWarn.value = true;
  } else if (!props.content) {
    showWarn.value = true;
  }
  props.warnChange && props.warnChange(showWarn.value);
}

const checkReg = (regs: RegExp[], testContent: string) => {
  // if (props.reg instanceof Array) {
  return regs.some(reg => reg.test(testContent));
  // } else {
  // @ts-ignore
  // return props.reg.test(testContent);
  // }
}
const checkBlcakList = (testContent: string, blackList?: String[]) => {
  return blackList && blackList.includes(testContent);
}

const changeShowWarnFlag = (flag: boolean, text: string) => {
  showWarn.value = flag;
  showWarnText.value = text;
  props.warnChange && props.warnChange(flag);
}
defineExpose({ changeShowWarnFlag })

</script>
<style lang="stylus" module>
  @import './index.styl'
</style>
<style lang="stylus" scoped>
  input{
    /* 清除原有input样式 */
    -web-kit-appearance:none;
    -moz-appearance: none;
    outline:0;
  }
  input:disabled{
    border: 1px solid #DDD;
    background-color: #F5F5F5;
    color:#ACA899;opacity: 1;
  }
</style>
<style scoped>
input {
  transition: all 0.2s;
  height: 28px;
  line-height: 28px;
  border: 1px solid;
  border-radius: 4px;
  border-color: #dcdfe6;
  padding-left: 8px;
}
input:focus {
  outline: 1px solid #00aeec;
  border: 1px solid #00aeec;
}
input::placeholder {
  color: #c0c4cc;
  font-size: 14px;
}

input[type="number"] ::-webkit-outer-spin-button,
::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
<!--  -->