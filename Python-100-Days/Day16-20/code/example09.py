def wrapper11(*args2, **kwargs2):
    print("Positional arguments:")
    for arg in args2:
        print(arg)
  
    print("\nKeyword arguments:")
    for key, value in kwargs2.items():
        print(f"{key} = {value}")

# 调用示例
wrapper11(1, 2, 3, a=4, b=5)