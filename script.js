document.addEventListener("DOMContentLoaded", () => {
    let logtxt="";

    const tokenInput=document.getElementById("token");
    const numRequestsInput=document.getElementById("numRequests");
    const numUsersInput=document.getElementById("numUsers");
    const generateInputsBtn=document.getElementById("generateInputsBtn");
    const sendRequestsBtn=document.getElementById("sendRequestsBtn");
    const recipientsContainer=document.getElementById("recipientsContainer");
    const responseLog=document.getElementById("responseLog");
    const downloadLogBtn=document.getElementById("downloadLogBtn");

    generateInputsBtn.addEventListener("click",() => {
        recipientsContainer.innerHTML="";
        const numUsers=parseInt(numUsersInput.value,10);
        if(numUsers<2){
            alert("2人以上のユーザーが必要です。");
            return;
        }
        for(let i=0;i<numUsers;i++){
            const label=document.createElement("label");
            label.textContent=`${i+1}人目のユーザーID: `;
            const input=document.createElement("input");
            input.type="text";
            input.id=`userId${i}`;
            input.name=`userId${i}`;
            recipientsContainer.appendChild(label);
            recipientsContainer.appendChild(input);
            recipientsContainer.appendChild(document.createElement("br"));
            recipientsContainer.appendChild(document.createElement("br"));
        }
    });

    sendRequestsBtn.addEventListener("click",async() => {
        responseLog.textContent="";
        logtxt="";

        const token=tokenInput.value;
        const numRequests=parseInt(numRequestsInput.value,10);
        const numUsers=parseInt(numUsersInput.value,10);
        if(!token){
            alert("トークンを入力してください。");
            return;
        }
        if(numUsers<2){
            alert("2人以上のユーザーが必要です。");
            return;
        }
        const recipients=[];
        for(let i=0;i<numUsers;i++){
            const userIdInput=document.getElementById(`userId${i}`);
            if(userIdInput){
                recipients.push(userIdInput.value.trim());
            }
        }
        const url="https://discord.com/api/v9/users/@me/channels";
        const headers={
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
            "Accept":"*/*",
            "Accept-Language":"ja,en-US;q=0.7,en;q=0.3",
            "Content-Type":"application/json",
            "Authorization":token,
            "X-Context-Properties":"eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJqYSIsImhhc19jbGllbnRfbW9kcyI6ZmFsc2UsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2OjEzNC4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzEzNC4wIiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTM0LjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzYyMzkyLCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==",
            "X-Discord-Locale":"ja",
            "X-Discord-Timezone":"Asia/Shanghai",
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Methods":"GET,POST,OPTIONS",
            "Access-Control-Allow-Headers":"Content-Type,Authorization,X-Context-Properties"
        };
        const data={recipients};
        for(let i=0;i<numRequests;i++){
            try{
                const response=await fetch(url,{
                    method:"POST",
                    headers:headers,
                    mode:"cors",
                    body:JSON.stringify(data)
                });
                if(!response.ok){
                    responseLog.textContent+=`\nエラー: ${response.status} ${response.statusText}`;
                    logtxt+=`\nエラー: ${response.status} ${response.statusText}`;
                    continue;
                }
                const result=await response.json();
                if(result.id){
                    responseLog.textContent+=`\nID: ${result.id}`;
                    logtxt+=`\nID: ${result.id}`;
                }else{
                    responseLog.textContent+="\nIDが含まれていません。";
                    logtxt+="\nIDが含まれていません。";
                }
            }catch(e){
                responseLog.textContent+=`\nリクエスト中にエラーが発生しました: ${e}`;
                logtxt+=`\nリクエスト中にエラーが発生しました: ${e}`;
            }
        }
    });

    downloadLogBtn.addEventListener("click",() => {
        const blob=new Blob([logtxt],{type:"text/plain"});
        const u=URL.createObjectURL(blob);
        const a=document.createElement("a");
        a.href=u;
        a.download="log.txt";
        a.click();
        URL.revokeObjectURL(u);
    });
});
