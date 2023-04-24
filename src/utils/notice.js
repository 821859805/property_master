export function toastSuccess(context,msg){
    context.$message.success(msg);
}
export function toastFail(context,msg){
    context.$message.error(msg);
}