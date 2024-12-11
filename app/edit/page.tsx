'use client'
import { PageContextProvider } from './context'
import FormItemEditor from './FormItemEditor'
import FormItemMenu from './FormItemMenu'
import Preview from './Preview'

export default function EditPage() {
  return (
    <PageContextProvider>
      <div className="grid min-h-screen grid-cols-[minmax(auto,10rem)_1fr_1fr]">
        <FormItemMenu />
        <FormItemEditor />
        <Preview />
      </div>
    </PageContextProvider>
  )
}
