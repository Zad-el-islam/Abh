import {serve,user} from '../_shared/runtime.ts';
serve(async(req,sb)=>{const who=await user(req,sb,false);return {ok:true,blocked:false,logged_in:!!who.user,role:who.role};});
