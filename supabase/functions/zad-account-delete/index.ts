import {serve,user,deleteUser} from '../_shared/runtime.ts';
serve(async(req,sb)=>{const who=await user(req,sb);await deleteUser(sb,who.user.id);return {ok:true,deleted:true};});
