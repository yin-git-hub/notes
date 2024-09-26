#### 元组

~~~c#
var pw = (firstName: "Phillis", lastName: "Wheatley", born: 1753, published: 1773);
firstName: "Phillis";  firstName:元组名 "Phillis"：元组值
    
// Create a 7-tuple.
var population = Tuple.Create("New York", 7891957, 7781984, 7894862, 7071639, 7322564, 8008278);
// Create a 7-tuple.
var population1 = new Tuple<string, int, int, int, int, int, int>(
    "New York", 7891957, 7781984, 
    7894862, 7071639, 7322564, 8008278);

~~~



#### 输出格式

~~~c#
// 25代表字符串大小 "-"号代表左对齐 ，反之右对齐
Console.WriteLine($"|{item.Key,-25}|{item.Value,10}|"); 
// price:C2  c是指货币C: 表示货币格式（Currency），会根据系统的区域设置（CultureInfo）将数字格式化为货币格式。例如，在美国区域设置下，C 会输出带有美元符号的数值。 2是指保留两位小数
Console.WriteLine($"On {date:d}, the price of {item} was {price:C2} per {unit}.");
// f是指日期格式的一种
Console.WriteLine($"{DateTime.Now:f}");

int X = 2;
int Y = 3; 
var pointMessage = $$"""The point {{{X}}, {{Y}}} is {{Math.Sqrt(X * X + Y * Y)}} from the origin."""; 
Console.WriteLine(pointMessage);
// Output:
// The point {2, 3} is 3.605551275463989 from the origin.

var pw = (firstName: "Phillis", lastName: "Wheatley", born: 1753, published: 1773);
Console.WriteLine("{0} {1} was an African American poet born in {2}.", pw.firstName, pw.lastName, pw.born);
Console.WriteLine("She was first published in {0} at the age of {1}.", pw.published, pw.published - pw.born);
Console.WriteLine("She'd be over {0} years old today.", Math.Round((2018d - pw.born) / 100d) * 100d);
~~~

#### 字符串

##### 声明字符串

~~~c#
string message1; 
string message2 = null; 
string message3 = System.String.Empty; 

char[] letters = { 'A', 'B', 'C' };
string alphabet = new string(letters); 

System.String greeting = "Hello World!"; 
var temp = "I'm still a strongly-typed System.String!"; 
const string message4 = "You can't get rid of me!";

// 字符串拼接 
string s1 = "A string is more ";
string s2 = "than the sum of its chars.";
s1 += s2; // 这里内存和java一样 
~~~

##### 字符串 "@"

~~~c#
// 使用 @ 符号前缀，可以直接在字符串中使用单个反斜杠（\），而不需要转义
string oldPath = "c:\\Program Files\\Microsoft Visual Studio 8.0"; 
string newPath = @"c:\Program Files\Microsoft Visual Studio 9.0";
string filePath = @"C:\Users\scoleridge\Documents\";
//Output: C:\Users\scoleridge\Documents\

// 字符串@的使用
string text = @"My pensive SARA ! thy soft cheek reclined
    Thus on mine arm, most soothing sweet it is
    To sit beside our Cot,...";
/* Output:
My pensive SARA ! thy soft cheek reclined
    Thus on mine arm, most soothing sweet it is
    To sit beside our Cot,...
*/

string quote = @"Her name was ""Sara.""";
// Output: Her name was "Sara."
~~~

##### 字符串“”“    ”“”

> 最后一个才是正确的

~~~c#
var multiLineStart = """This
    is the beginning of a string 
    """;

// CS9000: Raw string literal delimiter must be on its own line.
var multiLineEnd = """
    This is the beginning of a string """;
 
var noOutdenting = """
    A line of text.
Trying to outdent the second line.
    """;
    
var noOutdenting = """
                   A line of text.
                   Trying to outdent the second line.
                   """;
~~~

##### 字符串语法

~~~c#
string s3 = "Visual C# Express";
s3.Substring(7, 2); 
s3.Replace("C#", "Basic"); 
int index = s3.IndexOf("C");
s3[1] // i
~~~



#### 委托 base

>  * 写在前面
>  * 1.委托是一个类，事件是对象。
>  * 2.委托可以被外部的类调用，事件不可以。
>  * 3.事件相当于委托的一个变量。
>  * 4.委托可以把一个方法作为参数代入另一个方法。 委托可以理解为指向一个函数的指针。
>  * 5.委托可以通过“=”、“+=”、“-=”进行赋值，但是事件只能通过“+=”和“-=”对事件进行赋值。

~~~c#
namespace basic_first;

// 方法二 将委托声明写在类外边
// public delegate void MyDelegate(int a);
class 委托
{   // 方法一 将委托声明写在类里面
    public delegate void MyDelegate(int a);

    public void f1(int i)
    {
        Console.WriteLine("delegate f1");
    }
    
    public void f2(int i)
    {
        Console.WriteLine("delegate f2");
    }
}  

class TestMain
{
    static void Main(string[] args)
    {
        var wt = new 委托();
        委托.MyDelegate myDelegate = null;
        myDelegate += wt.f1;
        myDelegate += wt.f2;
        myDelegate(11);
    }
}
~~~

#### 委托 Action Func

>  * Action<T,T,T> 无返回值；
>  * Func<T,T,T> 有返回值，最后一位 T 就是返回值； 
>  * delegate 是类 还未实例化
>  * Action Func 已经定义好的泛型委托类型 必须在类里面实例化

~~~c#
namespace basic_first;
 
class MyDelegateClass
{
    public Func<int,string> func1;

    public Action action;

    public void a1()
    {
        Console.WriteLine("action 1");
    }
    
    public string f1(int i)
    {
        Console.WriteLine("delegate f1");
        return "return f1";
    }

    public string f2(int i)
    {
        Console.WriteLine("delegate f2");
        return "return f2";
    }
}  

class TestMain
{
    static void Main(string[] args)
    {
        var myDelegateClass = new MyDelegateClass();
        // Func
        myDelegateClass.func1 += myDelegateClass.f1;
        myDelegateClass.func1 += myDelegateClass.f2;
        string s;
        s = myDelegateClass.func1(1);
        Console.WriteLine(s);
        
        // Action
        myDelegateClass.action = myDelegateClass.a1;
        myDelegateClass.action();
    }
}
~~~

#### 事件

~~~c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
 
namespace 事件demo
{
    internal class Program
    {
        static void Main(string[] args)
        {
            User1 user1 = new User1();
            User2 user2 = new User2();
 
            MessageHandle.Receive("回家吃饭了");
 
            Console.ReadKey();
        }
    }
 
 
    public class MessageHandle
    {
        public delegate void OnMessage(string message);
 
        public static OnMessage OnMessageEvent = null;
 
        public static void Receive(string message)
        {
            if (OnMessageEvent != null)
                OnMessageEvent(message);
        }
 
        private MessageHandle() { }
    }
 
 
    public class User1
    {
        public void Receive(string msg)
        {
            Console.WriteLine("User1 收到消息：" + msg);
        }
 
        public User1()
        {
            MessageHandle.OnMessageEvent += Receive;
        }
    }
 
    public class User2
    {
        public void Receive(string msg)
        {
            Console.WriteLine("User2 收到消息：" + msg);
        }
 
        public User2()
        {
            MessageHandle.OnMessageEvent += Receive;
        }
    }
 
}
~~~

#### 事件 刘铁猛

~~~c#
using System.Timers;
using Timer = System.Timers.Timer;
namespace ConsoleApp1
{
    internal class Program
    {
        static void Main(string[] args)
        {//事件的拥有者 timer，事件成员 Elaspsed，事件的响应者 boy，事件的处理器Action，事件的订阅 +=
            Timer timer = new Timer();
            timer.Interval = 1000;
            Boy boy = new Boy();
            //Elapsed 事件: Timer 类的 Elapsed 事件是在定时器时间间隔到达时触发的事件
            timer.Elapsed += boy.Action11;
            timer.Start();
            Console.ReadLine();
        } 
    } 
    class Boy
    {
        internal void Action11(object sender, ElapsedEventArgs e)
        {
            Console.WriteLine("Learn?");
        }
    } 
}
~~~



#### List

~~~c#
// 1
var names = new List<string> { "<name>", "Ana", "Felipe" };
// 2
List<string> salmons = ["chinook", "coho", "pink", "sockeye"];

foreach (var name in names)
{
    Console.WriteLine($"Hello {name.ToUpper()}!");
}
Console.WriteLine();
// 新增
names.Add("Maria");
names.Add("Bill");
names.Insert(1, "jiandong");
// 删除
names.Remove("Ana");
names.RemoveAt(0);

foreach (var name in names)
{
    Console.WriteLine($"Hello {name.ToUpper()}!");
}
// 拿到脚标
var index = names.IndexOf("Felipe");
if (index != -1)
{
    Console.WriteLine($"The name {names[index]} is at index {index}");
}

var notFound = names.IndexOf("Not Found"); // -1
Console.WriteLine($"When an item is not found, IndexOf returns {notFound}");
names.Sort();

~~~

#### List 排序

##### 普通排序

~~~c#
var names = new List<string> { "name", "Ana", "Felipe" };
names.Sort();//Ana Felipe name
names.Reverse();//Felipe Ana name

foreach (var item in names)
{
    Console.WriteLine(item);
}
~~~

##### 对象排序 IComparable

~~~c#
class Student : IComparable<Student>
{
    public Student() { }
    public Student(int num, int age, string name)
    {
        this.num = num;
        this.age = age;
        this.name = name;
    }
    int num { get; set; }
    int age { get; set; }
    string name { get; set; }

    public int CompareTo(Student? other)
    {
        //return other.age.CompareTo(this.age);
        return this.age.CompareTo(other.age);
    }

    public override string ToString()
    {
        return $"{num} {age} {name}";
    }
}

class MyClass
{
    static void Main() {
        Student student = new Student(11111,11,"aaa1");
        Student student1 = new Student(22222, 55, "aaa2");
        Student student2 = new Student(33333, 33, "aaa3");
        List<Student> students = new List<Student>() {student,student1,student2 };
        students.Sort();
        foreach (var item in students)
        {
            Console.WriteLine(item);
        }

    }
}
~~~

##### 对象排序 比较器IComparer

~~~c#
class Student
{
    public Student() { }
    public Student(int num, int age, string name)
    {
        this.num = num;
        this.age = age;
        this.name = name;
    }
    public int num { get; set; }
    public int age { get; set; }
    public string name { get; set; }
 
    public override string ToString()
    {
        return $"{num} {age} {name}";
    }
}

public class StudentAgeASC : IComparer<Student>
{
    int IComparer<Student>.Compare(Student? x, Student? y)
    {
        return x.age.CompareTo(y.age);
    }
}

public class StudentAgeDESC : IComparer<Student>
{
    int IComparer<Student>.Compare(Student? x, Student? y)
    {
        return x.age.CompareTo(y.age);
    }
}

class MyClass
{
    static void Main() {
        Student student = new Student(11111,11,"aaa1");
        Student student1 = new Student(22222, 55, "aaa2");
        Student student2 = new Student(33333, 33, "aaa3");
        List<Student> students = new List<Student>() {student,student1,student2 };
        // 排序
        students.Sort(new StudentAgeASC());
        foreach (var item in students)
        {
            Console.WriteLine(item);
        }

    }
}
~~~



#### Dictionary

~~~c#
Dictionary<string,string> dict = new Dictionary<string,string>();
dict.Add("1", "q");
dict.Add("2", "w");
dict.Add("3", "e");

var inventory = new Dictionary<string, int>()
{
    ["hammer, ball pein"] = 18,
    ["hammer, cross pein"] = 5,
    ["screwdriver, Phillips #2"] = 14
};


Console.WriteLine(dict["1"]);

foreach (var item in dict.Keys)
{
    Console.WriteLine(item);
}

foreach (var item in dict.Values)
{
    Console.WriteLine(item);
}
~~~

#### 多个参数 object ...args

~~~c#
public void MyMethod(params object[] args)
{
    foreach (var arg in args)
    {
        Console.WriteLine(arg);
    }
}
~~~

#### DateTime

~~~c#
Console.WriteLine($"{DateTime.Now:f}");
    DateTime now = DateTime.Now;
        // 短日期模式
        Console.WriteLine($"Short Date (d): {now.ToString("d")}"); // Example: "8/21/2024"
        // 长日期模式
        Console.WriteLine($"Long Date (D): {now.ToString("D")}"); // Example: "Wednesday, August 21, 2024
        // 完整日期和时间（不包括秒）
        Console.WriteLine($"Full Date/Time (f): {now.ToString("f")}"); // Example: "Wednesday, August 21, 2024 2:30 PM"
        // 完整日期和时间（包括秒）
        Console.WriteLine($"Full Date/Time with Seconds (F): {now.ToString("F")}"); // Example: "Wednesday, August 21, 2024 2:30:15 PM"
        // 一般日期和时间（不包括秒）
        Console.WriteLine($"General Date/Time (g): {now.ToString("g")}"); // Example: "8/21/2024 2:30 PM"
        // 一般日期和时间（包括秒）
        Console.WriteLine($"General Date/Time with Seconds (G): {now.ToString("G")}"); // Example: "8/21/2024 2:30:15 PM"
        // 月份和日期
        Console.WriteLine($"Month and Day (M): {now.ToString("M")}"); // Example: "August 21"
        // RFC1123 日期和时间
        Console.WriteLine($"RFC1123 Date/Time (R): {now.ToString("R")}"); // Example: "Wed, 21 Aug 2024 14:30:15 GMT"
        // 可排序的日期和时间（ISO 8601）
        Console.WriteLine($"Sortable Date/Time (s): {now.ToString("s")}"); // Example: "2024-08-21T14:30:15"
        // 短时间模式
        Console.WriteLine($"Short Time (t): {now.ToString("t")}"); // Example: "2:30 PM"
        // 长时间模式
        Console.WriteLine($"Long Time (T): {now.ToString("T")}"); // Example: "2:30:15 PM"
        // 统一日期和时间（UTC）
        Console.WriteLine($"Universal Date/Time (u): {now.ToString("u")}"); // Example: "2024-08-21 14:30:15Z"
        // 年份和月份
        Console.WriteLine($"Year and Month (y): {now.ToString("y")}"); // Example: "August 2024"
        // 自定义格式：年-月-日
        Console.WriteLine($"Custom Format yyyy-MM-dd: {now.ToString("yyyy-MM-dd")}"); // Example: "2024-08-21"
        // 自定义格式：月份 日, 年
        Console.WriteLine($"Custom Format MMMM dd, yyyy: {now.ToString("MMMM dd, yyyy")}"); // Example: "August 21, 2024"
    
~~~

#### with表达式

> 目前的理解是，生成一个已有对象的副本，然后修改这个对象的值，再付只给原有对象

~~~c#
public readonly struct Coords
{
    public Coords(double x, double y)
    {
        X = x;
        Y = y;
    }

    public double X { get; init; }
    public double Y { get; init; }

    public override string ToString() => $"({X}, {Y})";
}

class MyClass
{
    
    public static void Main()
    {
        var p1 = new Coords(0, 2);
        Console.WriteLine(p1);  // output: (0, 0)

        var p2 = p1 with { X = 3 };
        Console.WriteLine(p2);  // output: (3, 0)

        var p3 = p1 with { X = 1, Y = 4 };
        Console.WriteLine(p3);  // output: (1, 4)
    }
    
}
~~~

#### 异步编程

1. `Task` 是基于 `Thread` 的，是比较高层级的封装，`Task `最终还是需要 `Thread` 来执行
2. `Task` 默认使用后台线程执行，`Thread` 默认使用前台线程
3. `Task` 可以有返回值，`Thread` 没有返回值
4. `Task` 可以执行后续操作，`Thread` 不能执行后续操作

~~~c#
// Thread
Thread thread = new Thread(obj => { Thread.Sleep(3000); });
thread.Start();
// Task
Task<int> task = new Task<int>(() => 
{
        Thread,Sleep(3000);
        return 1;
});
task.Start();
~~~

~~~c#
  static void asyncTest(string[] args)
  {
      // 创建一个 Task 对象，代表一个异步操作
      Task t = new Task(() =>
      {
          Console.WriteLine("任务开始工作……");
          Thread.Sleep(5000);  // 模拟任务工作过程，暂停5秒
      }); 
      // 启动任务
      t.Start(); 
      // 创建一个任务续接，在原任务完成后执行
      t.ContinueWith(task =>
      {
          Console.WriteLine("任务完成，完成时候的状态为：");
          Console.WriteLine("IsCanceled={0}\tIsCompleted={1}\tIsFaulted={2}",
                            task.IsCanceled, task.IsCompleted, task.IsFaulted);
      });
      // 等待用户按键，防止程序立即退出
      Console.ReadKey();
  }
~~~

##### Task的启动方式

> 1. new方式实例化一个Task，需要通过Start方法启动
> 2. Task.Factory.StartNew(Action action)创建和启动一个Task 
> 3. Task.Run(Action action)将任务放在线程池队列，返回并启动一个Task

~~~c#
//1.  new方式实例化一个Task，需要通过Start方法启动
Task task1 = new Task(() =>
{
    Thread.Sleep(100);
    Console.WriteLine($"hello, task1的线程ID为{Thread.CurrentThread.ManagedThreadId}");
});
task1.Start();

//2.  Task.Factory.StartNew(Action action)创建和启动一个Task     
Task task2 = Task.Factory.StartNew(() =>
{
    Thread.Sleep(100);
    Console.WriteLine($"hello, task2的线程ID为{ Thread.CurrentThread.ManagedThreadId}");
});

//3.  Task.Run(Action action)将任务放在线程池队列，返回并启动一个Task
Task task3 = Task.Run(() =>
{
    Thread.Sleep(100);
    Console.WriteLine($"hello, task3的线程ID为{ Thread.CurrentThread.ManagedThreadId}");
});

Console.WriteLine("执行主线程！");
Console.ReadKey();

~~~

##### Task等待、延续、组合

> Wait： 针对单个Task的实例，可以task1.wait进行线程等待（阻塞主线程）
> WaitAny： 线程列表中任何一个线程执行完毕即可执行（阻塞主线程）
> WaitAll： 线程列表中所有线程执行完毕方可执行（阻塞主线程）
> WhenAny： 与ContinueWith配合,线程列表中任何一个执行完毕，则继续ContinueWith中的任务（开启新线程，不阻塞主线程）
> WhenAll： 与ContinueWith配合,线程列表中所有线程执行完毕，则继续ContinueWith中的任务（开启新线程，不阻塞主线程）
> ContinueWith： 与WhenAny或WhenAll配合使用
> ContinueWhenAny： 等价于Task的WhenAny+ContinueWith
> ContinueWhenAll： 等价于Task的WhenAll+ContinueWith

###### 1. `Task.Wait`

等待单个任务完成。

```csharp
Task task = Task.Run(() => 
{
    Thread.Sleep(1000);  // 模拟一些工作
    Console.WriteLine("Task completed.");
});

task.Wait();  // 等待任务完成
Console.WriteLine("Task has been completed.");
```

###### 2. `Task.WaitAny`

等待多个任务中的任意一个完成。

```csharp
Task task1 = Task.Run(() => Thread.Sleep(1000));
Task task2 = Task.Run(() => Thread.Sleep(2000));

int index = Task.WaitAny(task1, task2);  // 等待任意一个任务完成
Console.WriteLine($"Task {index + 1} has completed.");
```

###### 3. `Task.WaitAll`

等待多个任务全部完成。

```csharp
Task task1 = Task.Run(() => Thread.Sleep(1000));
Task task2 = Task.Run(() => Thread.Sleep(2000));

Task.WaitAll(task1, task2);  // 等待所有任务完成
Console.WriteLine("All tasks have completed.");
```

###### 4. `Task.WhenAny`

> 与ContinueWith配合,
>
> 线程列表中任何一个执行完毕，
>
> 则继续ContinueWith中的任务（开启新线程，不阻塞主线程）

返回一个任务，当任意一个任务完成时，这个任务完成。

```csharp
Task task1 = Task.Run(() => Thread.Sleep(1000));
Task task2 = Task.Run(() => Thread.Sleep(2000));

Task<Task> firstCompletedTask = Task.WhenAny(task1, task2);
firstCompletedTask.ContinueWith(t => 
{
    Console.WriteLine("One of the tasks has completed.");
});
```

###### 5. `Task.WhenAll`

> 与ContinueWith配合,
>
> 线程列表中所有线程执行完毕，
>
> 则继续ContinueWith中的任务（开启新线程，不阻塞主线程）

返回一个任务，当所有任务完成时，这个任务完成。

```csharp
Task task1 = Task.Run(() => Thread.Sleep(1000));
Task task2 = Task.Run(() => Thread.Sleep(2000));

Task allTasks = Task.WhenAll(task1, task2);
allTasks.ContinueWith(t => 
{
    Console.WriteLine("All tasks have completed.");
});
```

###### 6. `Task.ContinueWith`

> 与WhenAny或WhenAll配合使用

在任务完成后，继续执行另一个任务。

```csharp
Task task = Task.Run(() => 
{
    Console.WriteLine("Task 1 is running.");
});

task.ContinueWith(t => 
{
    Console.WriteLine("Task 1 has completed. Now running Task 2.");
});
```

###### 7. `Task.Factory.ContinueWhenAny`

> 等价于Task的WhenAny+ContinueWith

当任意一个任务完成时，继续执行另一个任务。

```csharp
Task task1 = Task.Run(() => Thread.Sleep(1000));
Task task2 = Task.Run(() => Thread.Sleep(2000));

var continueWhenAny = Task.Factory.ContinueWhenAny(new[] { task1, task2 }, t => 
{
    Console.WriteLine("One of the tasks has completed. Now running a continuation task.");
});
continueWhenAny.Wait();
```

###### 8. `Task.Factory.ContinueWhenAll`

> 等价于Task的WhenAll+ContinueWith

当所有任务完成时，继续执行另一个任务。

```csharp
Task task1 = Task.Run(() => Thread.Sleep(1000));
Task task2 = Task.Run(() => Thread.Sleep(2000));

Task.Factory.ContinueWhenAll(new[] { task1, task2 }, tasks => 
{
    Console.WriteLine("All tasks have completed. Now running a continuation task.");
}).Wait();
```

##### task.Result

~~~c#
static void Main(string[] args)
{
    Task<string> task = Task.Run<string>(() => 
    {
        Thread.Sleep(3000);
        return "ming_堵塞线程";
    });
    Console.WriteLine(task.Result);
    Console.ReadKey();
}
~~~

#### `Task.Delay()` 和 `Thread.Sleep()` 区别

> Thread.Sleep()是同步延迟， Task.Delay()是异步延迟。
> Thread.Sleep()会阻塞线程， Task.Delay()不会。
> Thread.Sleep()不能取消， Task.Delay()可以。
> Task.Delay()和Thread.Sleep()最大的区别是Task.Delay()旨在异步运行，在同步代码中使用Task.Delay()是没有意义的；在异步代码中使用Thread.Sleep()是一个非常糟糕的主意。通常使用await关键字调用Task.Delay()。 

~~~c#
// 阻塞，出现CPU等待...
Task.Factory.StartNew(() =>
{
    Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + " ****** Start Sleep()******");
    for (int i = 1; i <=10; i++)
    {
        Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + "******Sleep******==>" + i);
        Thread.Sleep(1000); //同步延迟，阻塞一秒
    }
    Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + " ******End Sleep()******");
    Console.WriteLine();
});
     
// 不阻塞
Task.Factory.StartNew(() =>
{
    Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + " ======StartDelay()======");
    for (int i =1; i <=10; i++)
    {
        Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + " ======Delay====== ==>" + i);
        Task.Delay(1000);//异步延迟
    }
    Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + " ======End Delay()======");
    Console.WriteLine();
}); 
 // 不阻塞等待三秒
 Task.Factory.StartNew(async() =>
 {
     Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + " ======StartDelay()======");
     for (int i =1; i <=10; i++)
     {
         Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + " ======Await Delay====== ==>" + i);
         await Task.Delay(1000);//异步延迟
     }
     Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + " ======End Delay()======");
     Console.WriteLine();
 }); 
Console.ReadKey();
~~~

#### CancellationToken 和 CancellationTokenSource 取消线程

##### `CancellationToken`

> 属性

~~~c#
//表示当前CancellationToken是否可以被取消
public bool CanBeCanceled { get; }
//表示当前CancellationToken是否已经是取消状态
public bool IsCancellationRequested { get; }
~~~

> 方法

~~~c#
//往CancellationToken中注册回调
public CancellationTokenRegistration Register(Action callback);
//当CancellationToken处于取消状态时，抛出System.OperationCanceledException异常
public void ThrowIfCancellationRequested();
~~~

##### `CancellationTokenSource`

> 属性

~~~c#
//表示Token是否已处于取消状态
public bool IsCancellationRequested { get; }
//CancellationToken 对象
public CancellationToken Token { get; }
~~~

> 方法

~~~c#
//立刻取消
public void Cancel();
//立刻取消
public void Cancel(bool throwOnFirstException);
//延迟指定时间后取消
public void CancelAfter(int millisecondsDelay);
//延迟指定时间后取消
public void CancelAfter(TimeSpan delay);
~~~

##### CancellationTokenSource实现示例1

~~~c#
static async Task Main(string[] args)
    {
        // Step 1: 创建 CancellationTokenSource
        CancellationTokenSource cts = new CancellationTokenSource(); 
        // Step 2: 从 CancellationTokenSource 获取 CancellationToken
        CancellationToken token = cts.Token; 
        // Step 3: 启动一个可以取消的任务
        Task task = Task.Run(() => DoWork(token), token); 
        // Step 4: 等待用户输入取消任务
        Console.WriteLine("Press any key to cancel the task...");
        Console.ReadKey(); 
        // Step 5: 发出取消请求
        cts.Cancel();  
    } 
    static void DoWork(CancellationToken token)
    {
        for (int i = 0; i < 10; i++)
        {
            // 检查是否请求取消
            token.ThrowIfCancellationRequested();
            Thread.Sleep(1000); // 模拟长时间运行的操作
            Console.WriteLine("当前thread={0} 正在运行", Thread.CurrentThread.ManagedThreadId);
        }
    }
~~~

##### CancellationTokenSource实现示例2

~~~c#
public static void cancalAsyc()
    {
        CancellationTokenSource source = new CancellationTokenSource();
        // 注册一个线程取消后执行的逻辑
        source.Token.Register(() =>
        {
            //这里执行线程被取消后的业务逻辑.
            Console.WriteLine("-------------我是线程被取消后的业务逻辑---------------------");
        });
    
        Task.Run(() =>
        {
            // while (!source.IsCancellationRequested)
            {
                Thread.Sleep(1000);
                Console.WriteLine("当前thread={0} 正在运行", Thread.CurrentThread.ManagedThreadId);
            }
        }, source.Token); 
        Thread.Sleep(2000);
        source.Cancel();
    }
~~~

#### async 与 await

> - async 修饰符可将方法、lambda 表达式或匿名方法指定为异步。异步方法名字后习惯加个Async后缀
>
> - async 关键字修饰的方法一般包含一个或多个await 表达式或语句，如果不包含 await 表达式或语句，则该方法将同步执行。 编译器警告将通知你不包含 await 语句的任何异步方法。
> - async方法可以是下面三种返回类型：
>   - Task
>   - Task< TResult >
>   - void 这种返回类型一般用在event事件处理器中,或者用在你只需要任务执行，不关心任务执行结果的情况当中。
>     任何其他具有GetAwaiter方法的类型（从C#7.0开始）
>
> - await关键字只能在async 关键字修饰的方法（异步方法）中使用。
> - await 运算符的操作数通常是以下其中一个 .NET 类型：Task、Task、ValueTask 或 ValueTask。 但是，任何可等待表达式都可以是 await 运算符的操作数。
