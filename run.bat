if not exist node_modules (
    call npm install
)
call start .\index.html
call node .\index.js