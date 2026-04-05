import { defineStore } from 'pinia'

export const useCompareStore = defineStore('compare', {
  state: () => ({
    selectedIds: JSON.parse(localStorage.getItem('compare_ids') || '[]')
  }),
  getters: {
    count: state => state.selectedIds.length,
    hasItems: state => state.selectedIds.length > 0,
    isFull: state => state.selectedIds.length >= 3
  },
  actions: {
    add(id) {
      if (this.selectedIds.includes(id)) return false
      if (this.selectedIds.length >= 3) return false
      this.selectedIds.push(id)
      this._persist()
      return true
    },
    remove(id) {
      this.selectedIds = this.selectedIds.filter(pid => pid !== id)
      this._persist()
    },
    clear() {
      this.selectedIds = []
      this._persist()
    },
    isSelected(id) {
      return this.selectedIds.includes(id)
    },
    _persist() {
      localStorage.setItem('compare_ids', JSON.stringify(this.selectedIds))
    }
  }
})
