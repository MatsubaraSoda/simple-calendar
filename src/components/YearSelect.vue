<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

// 被选中的年份
const modelValue = defineModel<number>();
// list 的选项
defineProps<{
    options?: number[]
}>();

// 决定 list 是否打开
const isOpen = ref<boolean>(false);

// 点击 YearSelect 以外的区域，关闭 list
function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (!target.closest('.year-select')) {
        isOpen.value = false
    }
}
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// list 打开时，滚动到 modelValue 的位置
const ulRef = ref<HTMLElement | null>(null);
const liHeight = ref<number>(0);
watch(isOpen, async (isOpened) => {
    if (!isOpened) { return; }

    await nextTick();

    if (ulRef.value) {
        // 获取 list 中第一个 option 的高度，作为偏移基量
        const firstOptionElement = ulRef.value.children[0] as HTMLElement;
        liHeight.value = firstOptionElement?.offsetHeight ?? 0;

        // 当前年份 - 1970 获得偏移次数
        const targetIndex = (modelValue.value ?? 1970) - 1970;

        // 计算应滚动的像素，等于偏移基量（单行高度）乘以偏移次数
        const targetScrollTop = liHeight.value * targetIndex;

        ulRef.value.scrollTo({ top: targetScrollTop });
    }
})
</script>

<template>
    <div class="year-select">
        <button @click="isOpen = !isOpen" class="year-select__trigger">{{ modelValue }}</button>
        <ul v-if="isOpen" class="year-select__options" ref="ulRef">
            <li v-for="option in options" :key="option" class="year-select__option" @click="modelValue = option">{{ option }}</li>
        </ul>
    </div>
</template>

<style scoped>
.year-select {
    position: relative;
}

.year-select__trigger {
    height: 24px;
    font-size: 1em;
    width: 36px;
}

.year-select__trigger:hover {
    background-color: oklch(87% 0 0);
}

.year-select__options {
    position: absolute;
    top: calc(100% + 4px);
    left: -16px;
    height: 200px;
    overflow-y: auto;
    width: 68px;
    background-color: oklch(98.5% 0 0);
    border: 1px solid black;
    border-radius: 8px;
    scrollbar-width: none;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.year-select__options :first-child {
    border-radius: 8px 8px 0 0;
}

.year-select__options :last-child {
    border-radius: 0 0 8px 8px;
}

.year-select__option {
    flex: 1;
    width: 100%;
    text-align: center;
    cursor: pointer;
}

.year-select__option:hover {
    background-color: oklch(92.2% 0 0);
}

.year-select__option:active {
    background-color: oklch(87% 0 0);
}
</style>