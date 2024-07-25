import type { PageServerLoad, Actions } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";
// import type { PageServerLoad } from "./$types.js";
import { setError, superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
// import { serialize } from 'cookie';

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema)),
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }
        

        //Create account using Supabase
        const supabase = event.locals.supabase;
        const { email, password } = form.data;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.log(error);
            return setError(form, "password", "Invalid email or password");
        }
        else {
            // return redirect(303, "/");
            const url = new URL('/dashboard', event.url);
            url.searchParams.set('email', email);
            return redirect(303, url.toString());
        }
        
    },
};