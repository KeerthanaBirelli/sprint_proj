<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
 
  export let data: SuperValidated<Infer<FormSchema>>;
 
  const form = superForm(data, {
    validators: zodClient(formSchema),
  });
 
  const { form: formData, enhance } = form;
</script>
 
<div
  class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
>
<h1 class="text-2xl font-bold mb-8 text-center">Login to account</h1>
  <form method="POST" use:enhance>
    <div class="flex flex-col -mx-3 mb-2">
      <!-- Email Field -->
       <div class="w-full px-3 mb-6">
        <Form.Field {form} name="email">
          <Form.Control let:attrs>
            <Form.Label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Email</Form.Label>
            <Input
              {...attrs}
              bind:value={$formData.email}
              type="email"
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>

      <!-- Password Field -->
       <div class="w-full px-3 mb-6">
        <Form.Field {form} name="password">
          <Form.Control let:attrs>
            <Form.Label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Password</Form.Label>
            <Input
              {...attrs}
              bind:value={$formData.password}
              type="password"
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
    </div>

    <div class="flex justify-center mt-5">
    <button
      type="submit"
      class="hover:bg-yellow-500 bg-blue-400 text-white font-bold mt-5 ml-2 py-4 px-6 text-xl rounded"
    >
      Login
    </button>
    </div>
  </form>
</div>