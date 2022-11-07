import os
import threading
import time
import requests
import sys
import random
accountstxt=""
proxiestxt=""
count = 0
proxies = []
accounts=[]
script=""
debuggmode=False
#Gathers the global variables, uses them to run the bot file using cmd node command.
def run():
    global args
    global currentproxy
    global currentaccount
    global targetign
    if debuggmode!=True:
        #print(f'cmd /c "node {script} {targetign} {currentaccount} {currentproxy}"')
        os.system(f'cmd /c "node {script} {targetign} {currentaccount} {currentproxy}"')
    else:
        print(f'cmd /c "node {script} {targetign} {currentaccount} {currentproxy} true"')
        os.system(f'cmd /c "node {script} {targetign} {currentaccount} {currentproxy} true"')

#Title
url="https://pastebin.com/raw/cyEP1Vsh"
r=requests.get(url)
content=r.text
f=open("texttest.txt",'w')
f.write(content)
f.close()

f=open("texttest.txt",'r')
for i in f.readlines():
    if i.strip():
        print(i,end="")
f.close()
print("\n")

#Get the ign of the account the bots look for, and make sure the capitalisation is right (ease of access, makes it so you dont have to ensure the caps is correct)
bottype=input("Grinder or silent?")
if bottype.lower()=="silent":
    script="silentbot.js"
    targetign = input("Enter your ign: ")
elif bottype.lower()=="grinder":
    script="grinderbot.js"
    targetign="test"
    debugmode=input("Debug mode? Y/N")
    if debugmode.upper()=="Y":
        debuggmode=True
    else:
        debuggmode=False
else:
    sys.exit("pff")

botamount=int(input("Enter the amount of bots: "))
#botuser=input("Who is using the bot rn? Pulved,Kymp,Wex or cold? ")
accountstxt="alts.txt"
proxiestxt="proxies.txt"
link = "https://api.mojang.com/users/profiles/minecraft/" + targetign
data = requests.get(link).json()
targetign = data["name"]
args = ""
currentproxy =""
currentaccount=""
#Get the accounts and put them into accounts.txt
#url="https://pastebin.com/raw/EF92ZMgG"
#r=requests.get(url)
#content=r.text
#f=open("accounts.txt",'w')
#f.write(content)
#f.close()

#Get the proxies and put them into proxies.txt
#url="https://pastebin.com/raw/C9ZWcn1K"
#r=requests.get(url)
#content=r.text
#f=open("proxies.txt",'w')
#f.write(content)
#f.close()


delay=15
def getdelay():
    num=random.randint(60,120)
    return(num)

with open(proxiestxt, "r") as file:
    for i in file.readlines():
        a=i.strip()
        if a:
            proxies.append(a)

with open(accountstxt, "r") as f:
    for i in f.readlines():
        args = i.strip()
        if args:
            accounts.append(args)

amountofaccountsinlist=len(accounts)
randomnumbers=random.sample(range(amountofaccountsinlist), botamount)

for i in randomnumbers:
    currentaccount=accounts[i]
    currentproxy=proxies[i]
    t=threading.Thread(target=run)
    t.start()
    currentdelay=getdelay()
    print(f"Account sent, next one will be sent in {currentdelay} seconds")
    time.sleep(currentdelay)
