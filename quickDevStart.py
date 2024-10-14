import pyautogui

directories = ["server", "client", "admin"]

for directory in directories:
    pyautogui.hotkey("ctrl", "shift", "5", interval=0.25)
    pyautogui.typewrite(f"cd {directory}")
    pyautogui.press("enter")
    pyautogui.typewrite("npm run dev")
    pyautogui.press("enter")