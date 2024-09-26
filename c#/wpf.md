#### 布局

##### 窗体居中显示

> WindowStartupLocation="CenterScreen"
>
> ~~~xaml
> <Window x:Class="WpfApp1.MainWindow"
>         xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
>         xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
>         xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
>         xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
>         xmlns:local="clr-namespace:WpfApp1"
>         mc:Ignorable="d"
>         Title="MainWindow" Height="550" Width="1200" WindowStartupLocation="CenterScreen">
> ~~~



##### Grid

> 这是三行二列的网格
>
> 这个可以跨行、跨列
>
> ​	跨2行：Grid.RowSpan="2" 
>
> ​	跨2列：Grid.ColumnSpan="2"
>
> **“*”** 会撑满区域  “auto” 只会有内容撑起

```xaml
<Grid.RowDefinitions>
    <RowDefinition Height="Auto"  Grid.RowSpan="2"/>
    <RowDefinition Height="*" />
</Grid.RowDefinitions>

<Grid.ColumnDefinitions>
    <ColumnDefinition Width="*"  Grid.ColumnSpan="2" />
    <ColumnDefinition Width="*" />
    <ColumnDefinition Width="*" />
</Grid.ColumnDefinitions>
```

##### StackPanel

> 可以将元素 竖向 或 横向 排列
>
> Orientation="Horizontal"
>
> Orientation="Vertical"
>
>  HorizontalAlignment=center、left、right、stretch
>
>  VerticalAlignment=center、left、right、stretch

~~~xaml
  <StackPanel Orientation="Horizontal" VerticalAlignment="center">
      <Button x:Name="EditByIdButton" Content="编辑" Height="20" Click="EditByIdButton_Click" Tag="{Binding id}" Margin="2" Width="30"/>
      <Button x:Name="DelByIdButton" Content="删除" Height="20" Click="DelByIdButton_Click" Tag="{Binding id}" Margin="2" Width="30"/> 
  </StackPanel>
~~~

#### Canvas





#### 样式

> **不同类型**的统一样式

```xaml
<Window.Resources>
    <!-- Button Style -->
    <Style TargetType="Button">
        <Setter Property="Background" Value="#FF20B9E6"/>
        <Setter Property="Height" Value="50"/>
        <Setter Property="Width" Value="100"/>
    </Style>

    <!-- TextBox Style -->
    <Style TargetType="TextBox">
        <Setter Property="Background" Value="#FFE6E6FA"/>
        <Setter Property="Height" Value="30"/>
        <Setter Property="Width" Value="200"/>
        <Setter Property="Margin" Value="10"/>
    </Style>

    <!-- Label Style -->
    <Style TargetType="Label">
        <Setter Property="Foreground" Value="DarkBlue"/>
        <Setter Property="FontSize" Value="16"/>
        <Setter Property="HorizontalAlignment" Value="Center"/>
    </Style>
</Window.Resources>

<Grid>
    <Grid.RowDefinitions>
        <RowDefinition/>
        <RowDefinition/>
        <RowDefinition/>
    </Grid.RowDefinitions>

    <Grid.ColumnDefinitions>
        <ColumnDefinition/>
        <ColumnDefinition/>
    </Grid.ColumnDefinitions>

    <Button Content="按钮" Grid.Row="0" Grid.Column="0"/>
    <TextBox Text="请输入内容" Grid.Row="1" Grid.Column="0"/>
    <Label Content="标签" Grid.Row="2" Grid.Column="0"/>
</Grid>
```

> 同一类型的不同样式

~~~xaml
<Window.Resources>
    <Style x:Key="PrimaryButtonStyle" TargetType="Button">
        <Setter Property="Background" Value="#FF20B9E6"/>
        <Setter Property="Height" Value="50"/>
        <Setter Property="Width" Value="100"/>
    </Style>

    <Style x:Key="SecondaryButtonStyle" TargetType="Button">
        <Setter Property="Background" Value="#FFB9E620"/>
        <Setter Property="Height" Value="40"/>
        <Setter Property="Width" Value="80"/>
    </Style>
</Window.Resources>

<Grid>
    <Button Content="主按钮" Style="{StaticResource PrimaryButtonStyle}" Grid.Row="0" Grid.Column="0"/>
    <Button Content="次按钮" Style="{StaticResource SecondaryButtonStyle}" Grid.Row="0" Grid.Column="1"/>
</Grid>
~~~

#### 样式继承

~~~xaml
<Window.Resources>
    <!--基础样式-->
    <Style TargetType="Button">
        <Setter Property="FontSize" Value="20"/>
    </Style 

    <!--继承基础样式 添加引用-->
    <Style x:Key="quit" TargetType="Button" BasedOn="{StaticResource {x:Type Button}}">
        <Setter Property="Background" Value="#FFF1F1F1"/>
    </Style>
</Window.Resources>
~~~

#### 资源字典



> 第一步：定义资源字典  右键项目->添加->资源字典

~~~xaml
<!--基础样式-->
<Style TargetType="Button">
    <Setter Property="FontSize" Value="20"/>
</Style>
<!--继承基础样式 添加引用-->
<Style x:Key="login" TargetType="Button" BasedOn="{StaticResource {x:Type Button}}">
    <Setter Property="Background" Value="#FF06C5F0"/>
</Style>
<!--继承基础样式 添加引用-->
<Style x:Key="quit" TargetType="Button" BasedOn="{StaticResource {x:Type Button}}">
    <Setter Property="Background" Value="#FFF1F1F1"/>
</Style>
~~~

> 第二步：在app.xaml中添加这字典

~~~xaml
<Application.Resources>
     <!-- 添加多个全局的资源字典 -->
     <ResourceDictionary>
         <ResourceDictionary.MergedDictionaries>
             <!-- 第一个资源字典 -->
             <ResourceDictionary Source="/SourceDict/Dictionary1.xaml"/>
             <!-- 第二个资源字典 -->
             <ResourceDictionary Source="/SourceDict/Dictionary2.xaml"/>
             <!-- 第三个资源字典 -->
             <ResourceDictionary Source="/SourceDict/Dictionary3.xaml"/>
             <!-- 你可以继续添加更多的资源字典 -->
         </ResourceDictionary.MergedDictionaries>
     </ResourceDictionary>
</Application.Resources>
~~~

第三步：
1. 应用这个字典 Style

~~~xaml
<StackPanel Orientation="Vertical" HorizontalAlignment="Center" VerticalAlignment="Center">
    <!-- 使用 login 样式的按钮 -->
    <Button Content="登录" Style="{StaticResource login}" Width="100" Height="40"/>
    <!-- 使用 quit 样式的按钮 -->
    <Button Content="退出" Style="{StaticResource quit}" Width="100" Height="40" Margin="0,20,0,0"/>
</StackPanel>
~~~

2. 应用这个字典 Background FontWeight 等等

> 如果字典里面定义如下
> ~~~xaml
> <SolidColorBrush x:Key="quitc" Color="#FFF1F1F1"/>
> <FontWeight x:Key="ss" ></FontWeight>
> ~~~
>
> 那么就这么使用
>
> ~~~xaml
>   <Button  Margin="10" Background="{StaticResource blueBrush}" Content="Red Button" FontWeight="{StaticResource fontWeight}"/>
> ~~~
>

#### 控件重写

~~~xaml
<Grid>
    <!-- 第一个按钮 -->
    <Button Content="自定义按钮1" Background="#FF00805D" Width="120" Height="50" BorderBrush="Black" BorderThickness="4" Margin="198,159,482,176">
        <Button.Template>
            <ControlTemplate TargetType="Button">
                <Border Name="bbb" Background="{TemplateBinding Background}" BorderBrush="{TemplateBinding BorderBrush}" BorderThickness="{TemplateBinding BorderThickness}" CornerRadius="15">
                        <!--显示按钮的文本内容，并且居中对齐-->
                        <TextBlock Text="{TemplateBinding Content}" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                </Border>
                <!--
                    定义了两个触发器：
                    当鼠标悬停在按钮上时，背景色变为红色 (red)。
                    当按钮被按下时，背景色变为一种青绿色 (#FF10F3CA)。
                -->
                <ControlTemplate.Triggers>
                    <Trigger Property="IsMouseOver" Value="True">
                        <Setter TargetName="bbb" Property="Background" Value="red"/>
                    </Trigger>
                    <Trigger Property="IsPressed" Value="True">
                        <Setter TargetName="bbb" Property="Background" Value="#FF10F3CA"/>
                    </Trigger>
                </ControlTemplate.Triggers>
            </ControlTemplate>
        </Button.Template>
    </Button>

    <!-- 第二个按钮 -->
    <Button Content="自定义按钮2" Background="#FF9075BA" Width="120" Height="100" BorderBrush="Black" BorderThickness="4" Margin="468,151,212,184" Opacity="0.74" RenderTransformOrigin="0.047,0.344">
        <Button.Template>
            <ControlTemplate TargetType="Button">
                <Border Name="bbb" Background="{TemplateBinding Background}" BorderBrush="{TemplateBinding BorderBrush}" BorderThickness="{TemplateBinding BorderThickness}" CornerRadius="15">
                    <TextBlock Text="{TemplateBinding Content}" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                </Border>
                <ControlTemplate.Triggers>
                    <Trigger Property="IsMouseOver" Value="True">
                        <Setter TargetName="bbb" Property="Background" Value="red"/>
                    </Trigger>
                    <Trigger Property="IsPressed" Value="True">
                        <Setter TargetName="bbb" Property="Background" Value="#FF10F3CA"/>
                    </Trigger>
                </ControlTemplate.Triggers>
            </ControlTemplate>
        </Button.Template>
    </Button>
</Grid>
~~~

#### INotifyPropertyChanged 实现数据绑定

**c#**

~~~c#
 public partial class MainWindow : Window
 {
     Student stu = new Student();
     public MainWindow()
     {
         InitializeComponent();


         // 这里创建了一个新的Binding对象。Binding类用于定义如何从数据源获取数据并将其应用到绑定目标上。
         Binding binding = new Binding();
         binding.Source = stu; 
         binding.Path = binding.Path = new PropertyPath("Name");

         // 使用Binding连接数据源于Binding目标
         BindingOperations.SetBinding(tbx, TextBox.TextProperty, binding); 
     } 
     private void Tbx2_TextChanged(object sender, TextChangedEventArgs e)
     {
         stu.Name = tbx2.Text; 
         Debug.WriteLine(tbx2.Text);
     }
 } 
 class Student : INotifyPropertyChanged
 {
     public event PropertyChangedEventHandler PropertyChanged; 
     private string name; 
     public string Name
     {
         get { return name; }
         set
         {
             name = value;
             if (PropertyChanged != null)
             {
                 PropertyChanged.Invoke(this, new PropertyChangedEventArgs("Name"));
             }
         }
     }
 }
~~~

**xaml**

~~~xaml
  <Grid>
      <StackPanel >
          <TextBox Name="tbx" Height="50"  Margin="5" Text="TextBox1"/>
          <TextBox Name="tbx2" Height="50"  Margin="5" Text="TextBox2" TextChanged="Tbx2_TextChanged"/>
      </StackPanel>
  </Grid> 
~~~

#### wpf定时器

**c#**

~~~c#
public MainWindow()
{
    InitializeComponent();
    timer = new Timer(new TimerCallback(timerCall), null, 0, 1000);
}  
private void timerCall(object state)
{
    this.Dispatcher.BeginInvoke(new Action(() =>
    {
        tbx2.AppendText("定时器时间到 ");
    }));
}
~~~

**xaml**

~~~xaml
<TextBox Name="tbx2" Height="50"  Margin="5" Text="TextBox2" TextChanged="Tbx2_TextChanged"/>
~~~

