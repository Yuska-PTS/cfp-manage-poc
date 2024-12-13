'use client'
import { Button } from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormNote
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }),
  age: z.coerce.number(),
  birth: z.object({
    date: z.date()
  })
})

export default function EditPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      age: 0,
      birth: {
        date: new Date()
      }
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div className="m-auto w-[720px] p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-12 gap-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="請輸入年齡" {...field} />
                </FormControl>
                <FormNote>This is your public display name.</FormNote>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <FormLabel>Age</FormLabel>
                <FormDescription>描述描述描述描述描述描述~</FormDescription>
                <FormControl>
                  <Input placeholder="請輸入年齡" {...field} />
                </FormControl>
                <FormNote>This is your age.</FormNote>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birth.date"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                  <DatePicker placeholder="你的生日" {...field} />
                </FormControl>
                <FormNote>This is your birth date.</FormNote>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="col-span-12">
            submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
