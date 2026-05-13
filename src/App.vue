<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { weekdayOfFirstDay, daysInMonth, getCalendarToday } from '@/utils/dateTools'

interface CalendarDate {
  year: number;
  month: number;
  day: number;
}
// 今天的日期
const today = reactive<CalendarDate>(getCalendarToday());
// 日历显式的日期
const calendar = reactive<CalendarDate>(getCalendarToday());

// 本月第一天的星期
const firstWeekday = computed<number>(() => weekdayOfFirstDay(calendar.year, calendar.month));
// 本月的总天数
const totalDays = computed<number>(() => daysInMonth(calendar.year, calendar.month));

// 星期名字
const dayNames = ref<string[]>(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
// 先用 null 占位对齐月初星期，然后拼接当月 1 号到本月底,剩余使用 null 补全到第 42 个格子。
const days = computed<(number | null)[]>(() => {
  return [
    ...Array.from({ length: firstWeekday.value }, () => null),
    ...Array.from({ length: totalDays.value }, (_, i) => i + 1),
    ...Array.from({ length: 42 - (firstWeekday.value + totalDays.value) }, () => null),
  ]
})
</script>

<template>
  <main class="container">
    <div class="calendar">
      <!-- 头部区域 -->
      <header class="calendar__header">
        <h1 class="calendar__title">Simple Calendar</h1>

        <!-- 操作导航区 -->
        <nav class="calendar__nav">
          <!-- 年份操作 -->
          <div class="calendar__nav-group calendar__nav-group--year">
            <button class="calendar__btn calendar__btn--prev"><img src="/chevron-left.svg" class="calendar_icon"
                alt="Previous year"></button>
            <button class="calendar__btn calendar__btn--select">2026</button>
            <button class="calendar__btn calendar__btn--next"><img src="/chevron-right.svg" class="calendar_icon"
                alt="Next year"></button>
          </div>

          <!-- 月份操作 -->
          <div class="calendar__nav-group calendar__nav-group--month">
            <button class="calendar__btn calendar__btn--prev"><img src="/chevron-left.svg" class="calendar_icon"
                alt="Previous month"></button>
            <button class="calendar__btn calendar__btn--select">May</button>
            <button class="calendar__btn calendar__btn--next"><img src="/chevron-right.svg" class="calendar_icon"
                alt="Next month"></button>
          </div>

          <!-- 回到今天 -->
          <div class="calendar__nav-group calendar__nav-group--action">
            <button class="calendar__btn calendar__btn--today">Today</button>
          </div>
        </nav>
      </header>

      <!-- 星期表头 -->
      <div class="calendar__weekdays">
        <div v-for="dayName in dayNames" :key="dayName" class="calendar__weekday">
          <span>{{ dayName }}</span>
        </div>
      </div>

      <!-- 日期网格 -->
      <div class="calendar__grid">
        <div v-for="(day, i) in days" :key="i" class="calendar__day">
          <span
            :class="{ 'calendar__day--today': calendar.year === today.year && calendar.month === today.month && day === today.day }">{{
              day }}</span>
        </div>
      </div>

      <!-- 底部区域 -->
      <footer class="calendar__footer">
        <a href="" class="calendar__link"><img src="/github.svg" alt="GitHub" width="24" height="24"></a>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.container {
  min-height: 100vh;
  width: 450px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar {
  border: 1.5px solid black;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  background-color: oklch(98.5% 0 0);

  flex: 1;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 32px 240px 32px;
  gap: 6px;
}

.calendar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.calendar__title {
  font-size: 1.2em;
  font-weight: bold;
}

.calendar__nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.calendar__nav-group {
  border: 1px solid black;
  border-radius: 8px;
  overflow: hidden;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar__btn {
  height: 24px;
}

.calendar__btn:hover {
  background-color: oklch(87% 0 0);
}

.calendar__btn--select {
  font-size: 1em;
  width: 36px;
}

.calendar__btn--today {
  font-size: 1em;
  padding: 0 5px;
}

.calendar_icon {
  width: 16px;
  height: 16px;
}

.calendar__weekdays {
  display: flex;
  align-items: center;
}

.calendar__weekday {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

.calendar__day {
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar__day>span {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar__day>span:hover {
  background-color: oklch(87% 0 0);
}

.calendar__day--today {
  background-color: oklch(92.2% 0 0);
}

.calendar__footer {
  display: flex;
  justify-content: end;

  padding: 0 16px;
}
</style>
