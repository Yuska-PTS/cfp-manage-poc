'use client'
import { PageContextProvider } from './context'
import FormItemEditor from './FormItemEditor'
import FormItemMenu from './FormItemMenu'

export default function EditPage() {
  return (
    <PageContextProvider>
      <div className="grid grid-cols-[10rem_1fr]">
        <FormItemMenu />
        <FormItemEditor />
      </div>
    </PageContextProvider>
  )
}
