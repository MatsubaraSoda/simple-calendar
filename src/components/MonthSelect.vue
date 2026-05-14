<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { getCalendarToday } from '@/utils/dateTools'

// 月份映射
const MONTH_ABBR_BY_NUMBER: Record<number, string> = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
};

// 被选中的月份
// number 类型，用于写逻辑代码
const modelValue = defineModel<number>();
// string 类型，用于展示
const selectedMonth = computed<string>(() => {
    const monthNumber = modelValue.value ?? getCalendarToday().month;
    return MONTH_ABBR_BY_NUMBER[monthNumber] ?? '';
});

// 决定 list 是否打开
const isOpen = ref<boolean>(false);

// 点击 MonthSelect 以外的区域，关闭 list
function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (!target.closest('.month-select')) {
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

        // 偏移次数
        const targetIndex = (modelValue.value ?? 1) - 1;

        // 计算应滚动的像素，等于偏移基量（单行高度）乘以偏移次数
        const targetScrollTop = liHeight.value * targetIndex;

        ulRef.value.scrollTo({ top: targetScrollTop });
    }
})
</script>

<template>
    <div class="month-select">
        <button @click="isOpen = !isOpen" class="month-select__trigger">{{ selectedMonth }}</button>
        <ul v-if="isOpen" class="month-select__options" ref="ulRef">
            <li v-for="(monthAbbr, monthNumber) in MONTH_ABBR_BY_NUMBER" :key="monthNumber" class="month-select__option"
                @click="modelValue = parseInt(monthNumber, 10)">{{ monthAbbr }}</li>
        </ul>
    </div>
</template>

<style scoped>
.month-select {
    position: relative;
}

.month-select__trigger {
    height: 24px;
    font-size: 1em;
    width: 36px;
}

.month-select__trigger:hover {
    background-color: oklch(87% 0 0);
}

.month-select__options {
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

.month-select__options :first-child {
    border-radius: 8px 8px 0 0;
}

.month-select__options :last-child {
    border-radius: 0 0 8px 8px;
}

.month-select__option {
    flex: 1;
    width: 100%;
    text-align: center;
    cursor: pointer;
}

.month-select__option:hover {
    background-color: oklch(92.2% 0 0);
}

.month-select__option:active {
    background-color: oklch(87% 0 0);
}
</style>