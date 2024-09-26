#### 托管

~~~xaml
<PropertyGroup>
    <TargetFramework>netcoreapp2.2</TargetFramework>
    <AspNetCoreHostingModel>InProcess</AspNetCoreHostingModel>
</PropertyGroup>
~~~

> - InProcess：使用IIS[服务器托管](https://zhida.zhihu.com/search?q=服务器托管&zhida_source=entity&is_preview=1)
> - OutOfProcess：使用自带Kestrel服务器托管

#### 依赖注入

- 代码在Yin.Net8的controller和Program里面

> 依赖注入框架的核心类型
>
> - IServiceCollection 负责服务注册
> - ServiceDescriptor 每一个服务注册时的信息
> - IServiceProvider 这是一个具体的容器，由IServiceCollection build出来的
> - IServiceScope 表示一个容器的生命周期

> .net core里面的生命周期
>
> - 单例 singleton
> - 作用域 scoped
> - 瞬时 ：每次调用就会创建一个新的对象 transient

**注意**：

1. 容器的生命周期和对象的生命周期一样
2. 容器只会管理他创建的对象，我们创建对象放进去他不会进行管理。

**建议**：

1. 避免在根容器获取实现了IDisposable 接口的瞬时服务
2. 避免手动创建实现了 IDisposable 对象，应该使用容器来管理其生命周期

> `IDisposable` 接口 它用于实现资源的释放模式，特别是那些非托管资源（如文件句柄、数据库连接、网络连接等）。当一个对象实现了`IDisposable`接口，它允许开发者在对象不再需要时显式地释放资源，以避免资源泄露。

##### 代码展示

> 容器注入：
>
> 1. 准备一些简单的类
>
>    ~~~c#
>    namespace Yin.Net8.LifeTimeScope
>    {
>        public interface IMyGeneric<T> { } 
>        public class MyGeneric<T>:IMyGeneric<T>
>        {
>            public T Value { get; set; } 
>            public MyGeneric() { }
>            public MyGeneric(T value) 
>            {
>                this.Value = value;
>            } 
>        }
>    }
>    namespace Yin.Net8.LifeTimeScope
>    {
>        public interface IMyScope{} 
>        public class MyScope: IMyScope { }
>    }
>    namespace Yin.Net8.LifeTimeScope
>    {
>        public interface IMySingleton{} 
>        public class MySingleton : IMySingleton{}
>    }
>    namespace Yin.Net8.LifeTimeScope
>    {
>        public interface IMyTransient{} 
>        public class MyTransient:IMyTransient{}
>    } 
>    ~~~
>
> 2. 向容器里面注册服务
>
>    **在Program.cs里面注册**
>
>    ~~~c#
>    #region 向容器里面注册
>    #region 泛型的方式向容器中注册服务
>    builder.Services.AddSingleton<IMySingleton, MySingleton>();
>    builder.Services.AddScoped<IMyScope, MyScope>();
>    builder.Services.AddTransient<IMyTransient, MyTransient>();
>    #endregion
>    
>    #region 实例对象方式、工厂模式向容器中注册服务
>    //IMyScope myScope = new MyScope();
>    // 实例对象方式 只有单例模式可以
>    //builder.Services.AddSingleton<IMyScope>(myScope);
>    
>    // 工厂模式 这三个生命周期都可以
>    //builder.Services.AddSingleton<IMySingleton>(i => { 
>    //return new MySingleton();
>    //});
>    
>    //builder.Services.AddSingleton<IMyScope>(i => {
>    //    return new MyScope();
>    //});
>    
>    //builder.Services.AddSingleton<IMyTransient>(i => {
>    //    return new MyTransient();
>    //});
>    #endregion
>    
>    #region 尝试注册
>    /*针对接口 只要这个接口注册了就不能再注册了 发现已经注册了就不在注册了*/
>    //builder.Services.TryAddSingleton<IMySingleton, MySingleton>();
>    
>    /*针对实现类，只要实现类没注册就可以注册*/
>    //builder.Services.TryAddEnumerable(ServiceDescriptor.Singleton<IMySingleton, MySingleton>());
>    #endregion
>    
>    #region 移除和替换注册
>    //builder.Services.RemoveAll<IMySingleton>();
>    
>    /*把IMySingleton注册接口实现类注册的第一个服务替换掉*/
>    //builder.Services.Replace(ServiceDescriptor.Singleton<IMySingleton, MySingleton>());
>    #endregion
>    
>    #region 泛型模版注册
>    //使用方法 见Controller的构造函数
>    //builder.Services.AddSingleton(typeof(IMyGeneric<>),typeof(MyGeneric<>)); 
>    #endregion
>    #endregion 
>    ~~~
>
> 3. 使用
>
>    ~~~c#
>    // 第一种方法 
>    public WeatherForecastController(ILogger<WeatherForecastController> logger,IMyGeneric<IMyScope> myGeneric)
>    {
>        _logger = logger;
>    }
>    //第二种方法
>    [HttpGet("life1")]
>    public int GetLife(
>        [FromServices] IMySingleton mySingleton1,
>        [FromServices] IMySingleton mySingleton2,
>        [FromServices] IMyScope myScope1,
>        [FromServices] IMyScope myScope2,
>        [FromServices] IMyTransient myTransient1,
>        [FromServices] IMyTransient myTransient2
>    )
>    {
>        Console.WriteLine($"mySingleton1 {mySingleton1.GetHashCode()}");
>        Console.WriteLine($"mySingleton2 {mySingleton2.GetHashCode()}");
>        Console.WriteLine($"myScope1 {myScope1.GetHashCode()}");
>        Console.WriteLine($"myScope2 {myScope2.GetHashCode()}");
>        Console.WriteLine($"myTransient1 {myTransient1.GetHashCode()}");
>        Console.WriteLine($"myTransient2 {myTransient2.GetHashCode()}");
>        return 1;
>    }
>    ~~~

#### AutoFac

> 引入AutoFac包
>
> 构造函数注入：直接看代码
>
> 属性注入：直接看代码
>
> 属性注入扩展：PropertySelector--用来选择哪个属性可以注入。

**属性注入扩展**

- 添加一个全新的类库 AutoFacFramework

- 添加AutoFacFramework的CustomSelect来判断是否需要属性注入

  ```
  [CustomSelect]
  public IPropertyTest2 _PropertyTest2 { get; set; }
  ```

- 如何判断：AutoFacFramework中引入AutoFac包
  - 创建CustomPropertySelector并继承 IPropertySelector，在这里判断那些属性需要做属性需要做属性注入
  
  - 然后
  
    ~~~c#
     containerBuilder.RegisterType<PropertyTest1>().As<IPropertyTest>()
                    // 方法注入
                    .OnActivated(active =>
                    {
                        IPropertyTest3 ipt = active.Context.Resolve<IPropertyTest3>();
                        active.Instance.MethodInsert(ipt);
                    })
                    // 用来选择哪个属性可以注入
                    .PropertiesAutowired(new CustomPropertySelector());
    ~~~
  
    

> 方法注入：看代码

> 单个抽象多个实现: 看代码

>autoFac 整合 asp.net

~~~c#
Autofac
Autofac.Extensions.DependencyInjection
~~~

- 在Programe里面进行整合
- 通过工厂替换整合AutoFac

  ~~~c#
  #region autofac 整合到 asp.net
  
  // 通过工厂替换，把Autofac整合进来
  builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
  builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory())
      .ConfigureContainer<ContainerBuilder>(builder =>
      {
          builder.RegisterType<MyService>().As<IMyService>();
          builder.RegisterType<PropertyTest4>().As<IPropertyTest>();
          builder.RegisterType<PropertyTest5>().As<IPropertyTest>();
          builder.RegisterType<WeatherForecastController>().As<ControllerBase>();
      });
              
  #endregion
  ~~~
- 使用

  ~~~c#
  public WeatherForecastController(ILogger<WeatherForecastController> logger,IMyService myService,IEnumerable<IPropertyTest> propertyTests)
  {
      _logger = logger; 
  }
  ~~~

> **控制器**里面的**属性注入**
>
> 第一部分
>
> ~~~c#
> builder.Services.Replace(
>            ServiceDescriptor.Transient<IControllerActivator, ServiceBasedControllerActivator>());
> ~~~
>
> 第二部分
>
> ~~~c#
>   // 注册每个控制器和抽象之间关系
> var controllerBaseType = typeof(ControllerBase);
> builder.RegisterAssemblyTypes(typeof(Program).Assembly)
> 	// 过滤出所有从 ControllerBase 派生的类型，即所有继承了 ControllerBase 的控制器类，排除掉 ControllerBase 本身
> 	.Where(t => controllerBaseType.IsAssignableFrom(t) && t != controllerBaseType)
> ~~~
>
> 完整代码
>
> ~~~c#
> #region autofac 整合到 asp.net
> 
> // 通过工厂替换，把Autofac整合进来
> builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
> builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory())
>     .ConfigureContainer<ContainerBuilder>(builder =>
>     {
>         builder.RegisterType<MyService>().As<IMyService>();
>         builder.RegisterType<PropertyTest4>().As<IPropertyTest>();
>         builder.RegisterType<PropertyTest5>().As<IPropertyTest>();
>         builder.RegisterType<WeatherForecastController>().As<ControllerBase>();
>         
>         // 注册每个控制器和抽象之间关系
>         var controllerBaseType = typeof(ControllerBase);
>         builder.RegisterAssemblyTypes(typeof(Program).Assembly)
>         // 过滤出所有从 ControllerBase 派生的类型，即所有继承了 ControllerBase 的控制器类，排除掉ControllerBase 本身
> 		.Where(t => controllerBaseType.IsAssignableFrom(t) && t != controllerBaseType)
> 		// 支持属性注入
> 		.PropertiesAutowired(new CustomPropertySelector());
> 	});
>             
> // 控制器注册
> // 支持控制器的实例让 Autofac IOC 容器来创建
> {
>     builder.Services.Replace(
>         ServiceDescriptor.Transient<IControllerActivator, ServiceBasedControllerActivator>());
> }
> 
> #endregion
> ~~~

#### AutoFac对AOP的支持

- 下载包**Castle.Core**

- 然后在AutoFacFramework创建类

  ~~~c#
  public class CustomInterceptor:IInterceptor
  {
      public void Intercept(IInvocation invocation)
      {
          throw new NotImplementedException();
      }
  }
  ~~~

- 然后再去Programe里面注册

  > 实现方式1
  >
  > ~~~c#
  > // 将切面的那个类注入到容器
  > builder.RegisterType<CustomInterceptor>();
  > builder.RegisterType<MyService>()
  >     .As<IMyService>()
  >     // 启用接口拦截
  >     .EnableInterfaceInterceptors() 
  >     .InterceptedBy(typeof(CustomInterceptor));
  > ~~~
  >
  > 完整代码
  >
  > ~~~c#
  >   builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory())
  >        .ConfigureContainer<ContainerBuilder>(builder =>
  >        {
  >            // 将切面的那个类注入到容器
  >            builder.RegisterType<CustomInterceptor>();
  >            builder.RegisterType<MyService>()
  >                .As<IMyService>()
  >                // 启用接口拦截
  >                .EnableInterfaceInterceptors() 
  >                .InterceptedBy(typeof(CustomInterceptor));
  >            
  >            
  >            builder.RegisterType<PropertyTest4>().As<IPropertyTest>();
  >            builder.RegisterType<PropertyTest5>().As<IPropertyTest>();
  >            builder.RegisterType<WeatherForecastController>().As<ControllerBase>();
  >            
  >            // 注册每个控制器和抽象之间关系
  >            var controllerBaseType = typeof(ControllerBase);
  >            builder.RegisterAssemblyTypes(typeof(Program).Assembly)
  >    // 过滤出所有从 ControllerBase 派生的类型，即所有继承了 ControllerBase 的控制器类，排除掉 ControllerBase 本身
  >            .Where(t => controllerBaseType.IsAssignableFrom(t) && t != controllerBaseType)
  >            // 支持属性注入
  >            .PropertiesAutowired(new CustomPropertySelector());
  >        });
  > ~~~
  >
  > 实现方式2
  >
  > ~~~c#
  > // 将切面的那个类注入到容器
  > builder.RegisterType<CustomInterceptor>();
  > builder.RegisterType<MyService>()
  >     .As<IMyService>()
  >     // 启用接口拦截
  >     .EnableInterfaceInterceptors();
  > ~~~
  >
  > 这一个需要在你要环切的类上添加以下代码
  >
  > ~~~c#
  > // CustomInterceptor是填写环切前后的代码逻辑
  > [Intercept(typeof(CustomInterceptor))]
  > public class MyService : IMyService
  > ~~~


#### AutoFac对AOP的两种支持

- 一种就是前面的那种用的类

- 另一种是用的接口 .EnableInterfaceInterceptors()，其他操作都一样

  ```
  builder.RegisterType<MyService>()
      .As<IMyService>()
      // 启用接口拦截
      .EnableInterfaceInterceptors();
  ```

- 扩展：拦截选择

  ```c#
  // 将切面的那个类注入到容器
  builder.RegisterType<CustomTestInterceptor>();
  builder.RegisterType<CustomLogInterceptor>();
  
  builder.RegisterType<MyService>()
      .As<IMyService>()
      // 启用接口拦截
      // .EnableInterfaceInterceptors()
      // 启用类拦截
      .EnableInterfaceInterceptors(new ProxyGenerationOptions()
      {
          Selector = new CustomInterceptorSelector()
      })
      .InterceptedBy(typeof(CustomTestInterceptor),typeof(CustomLogInterceptor));
  ```

  ~~~c#
  public class CustomInterceptorSelector: IInterceptorSelector
  {
      /// <summary>
      /// 让我们选择使用哪一个Interceptor
      /// </summary> 
      public IInterceptor[] SelectInterceptors(Type type, MethodInfo method, IInterceptor[] interceptors)
      {
          Console.WriteLine("start custom interceptorSelector");
          // 如果方法名包含 "Log"，选择日志拦截器
          if (method.Name.Contains("Code"))
          {
              return interceptors.Where(i => i is CustomLogInterceptor ).ToArray();
          } 
          if (method.Name.Contains("Test1"))
          {
              return interceptors.Where(i =>i is CustomTestInterceptor).ToArray();
          }
          Console.WriteLine("end custom interceptorSelector");
          // 默认返回所有拦截器
          return interceptors;
      }
  }
  ~~~

- 注册的时候要注意格式

  ~~~c#
   // 将切面的那个类注入到容器
  builder.RegisterType<CustomTestInterceptor>();
  builder.RegisterType<CustomLogInterceptor>(); 
  builder.RegisterType<MyService>()
      .As<IMyService>()
      // 启用接口拦截
      // .EnableInterfaceInterceptors()
      // 启用类拦截
      .EnableInterfaceInterceptors(new ProxyGenerationOptions()
      {
          // 这里是那个切面
          Selector = new CustomInterceptorSelector()
      })
      .InterceptedBy(typeof(CustomTestInterceptor),typeof(CustomLogInterceptor));
  ~~~

  
