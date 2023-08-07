using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using CefSharp;
using CefSharp.WinForms;

namespace Babylon
{
    public partial class Form1 : Form
    {
        [DllImport("user32.dll", SetLastError = true)]
        static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy,
            UInt32 uFlags);

        private CallbackObjectForJs _callBackObjectForJs;
        string fileName;

        public Form1()
        {
            TopMost = true;
            TopLevel = true;
            InitializeComponent();
            var dir = Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location);
            dir = Path.Combine(dir, "cache");
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            var settings = new CefSettings
            {
                CachePath = dir,

                //BrowserSubprocessPath = "".GetEntryPath()
            };
            Cef.Initialize(settings);
            SetWindowPos(this.Handle, new IntPtr(-1), this.Left, this.Top, this.Width, this.Height, 0x0040);

            var browser = new ChromiumWebBrowser("http://192.168.8.189:9000/vs.html");
            // "http://192.168.8.189:9000/vs.html"
            this.Controls.Add(browser);

            browser.Dock = DockStyle.Fill;
            _callBackObjectForJs = new CallbackObjectForJs();

            browser.JavascriptObjectRepository.Settings.LegacyBindingEnabled = true;
            browser.JavascriptObjectRepository.Register("callbackObj", _callBackObjectForJs, isAsync: false,
                options: BindingOptions.DefaultBinder);
            browser.LoadingStateChanged += ((sender, args) =>
            {
                if (args.IsLoading == false)
                {
                    var files = Clipboard.GetFileDropList();
                    if (files.Count > 0 && File.Exists(files[0]))
                    {
                        fileName = files[0];
                    }
                    else
                    {
                        var s = Clipboard.GetText();
                        if (File.Exists(s))
                        {
                            fileName = s;
                        }
                        else
                        {
                            GenerateBabylonPlayGround(s);
                        }
                    }

                    _callBackObjectForJs.FileName = fileName;
                    // File.ReadAllText(fileName)
                    if (File.Exists(fileName))
                        browser.EvaluateScriptAsync(
                            $"editor.getModel().setValue('{File.ReadAllText(fileName).Replace("\n", "\\n").Replace("\r", "").Replace("'", "\\'")}')");
                }
            });
            /*browser.KeyUp += (async (sender, args) =>
            {
                if (args.KeyCode == Keys.F5)
                {
                    var task = browser.EvaluateScriptAsync("editor.getValue()");
                    task.ContinueWith(res =>
                    {
                        var r = res.Result;
                        if (r.Success && r.Result != null)
                        {
                            Text = r.Result.ToString();
                        }
                    });
                }
            });*/
        }
        public void GenerateBabylonPlayGround(String s)
        {
            var dir = "Babylon".GetEntryPath();
            var w = "Babylon".GetDesktopPath();
            w.CreateDirectoryIfNotExists();


            w = Path.Combine(w, s);
            w.CreateDirectoryIfNotExists();
            var extensions = "js|css|html".Split('|');
            foreach (var element in extensions)
            {
                var f = Path.Combine(w, "index." + element);
                if (element == "js")
                {
                    fileName = f;
                }
                if (!File.Exists(f))
                    File.Copy(Path.Combine(dir, "index." + element), f);
            }

            Path.Combine(w, "textures").CreateDirectoryIfNotExists();
            Path.Combine(w, "scenes").CreateDirectoryIfNotExists();
        }
    }

    

    public class CallbackObjectForJs
    {
        public string FileName;

        public void showMessage(string msg)
        {
            if (File.Exists(FileName))
                File.WriteAllText(FileName, msg);
        }
    }

    public static class Strings
    {
        public static string RemoveWhiteSpaceLines(this string str)
        {
            return string.Join(Environment.NewLine,
                str.Split(Environment.NewLine.ToCharArray(), StringSplitOptions.RemoveEmptyEntries)
                    .Where(i => !string.IsNullOrWhiteSpace(i)));
        }

        public static string SubstringAfter(this string value, char delimiter)
        {
            var index = value.IndexOf(delimiter);
            if (index == -1)
                return value;
            else
                return value.Substring(index + 1);
        }

        public static string SubstringAfter(this string value, string delimiter)
        {
            var index = value.IndexOf(delimiter);
            if (index == -1)
                return value;
            else
                return value.Substring(index + delimiter.Length);
        }

        public static string SubstringAfterLast(this string value, char delimiter)
        {
            var index = value.LastIndexOf(delimiter);
            if (index == -1)
                return value;
            else
                return value.Substring(index + 1);
        }

        public static string SubstringBefore(this string value, char delimiter)
        {
            var index = value.IndexOf(delimiter);
            if (index == -1)
                return value;
            else
                return value.Substring(0, index);
        }

        public static string SubstringBefore(this string value, string delimiter)
        {
            var index = value.IndexOf(delimiter);
            if (index == -1)
                return value;
            else
                return value.Substring(0, index);
        }

        public static string SubstringBeforeLast(this string value, string delimiter)
        {
            var index = value.LastIndexOf(delimiter);
            if (index == -1)
                return value;
            else
                return value.Substring(0, index);
        }

        public static string SubstringTakeout(this string value, string startDelimiter, string endDelimiter)
        {
            var startIndex = value.LastIndexOf(startDelimiter);
            if (startIndex == -1)
                return value;
            var endIndex = value.LastIndexOf(endDelimiter, startIndex + startDelimiter.Length);
            if (endIndex == -1)
                return value;
            return value.Substring(0, startIndex) + value.Substring(endIndex + endDelimiter.Length);
        }

        public static string SubstringBlock(this string value, string delimiter, string s)
        {
            var startIndex = value.LastIndexOf(delimiter);
            if (startIndex == -1)
                return value;
            var count = 0;
            startIndex += delimiter.Length;
            for (int index = startIndex; index < value.Length; index++)
            {
                if (value[index] == '{')
                {
                    count++;
                }
                else if (value[index] == '}')
                {
                    count--;
                    if (count == 0)
                    {
                        var s1 = value.Substring(0, startIndex);
                        var s2 = s + value.Substring(index + 1);
                        return value.Substring(0, startIndex) + s + value.Substring(index + 1);
                    }
                }
            }

            return value;
        }

        public static IEnumerable<string> ToBlocks(this string value)
        {
            var count = 0;
            StringBuilder sb = new StringBuilder();
            List<string> ls = new List<string>();
            foreach (var t in value)
            {
                sb.Append(t);
                switch (t)
                {
                    case '{':
                        count++;
                        continue;
                    case '}':
                    {
                        count--;
                        if (count == 0)
                        {
                            ls.Add(sb.ToString());
                            sb.Clear();
                        }

                        continue;
                    }
                }
            }

            return ls;
        }

        public static string GetEntryPath(this string filename)
        {
            return Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location),
                filename);
        }

        public static string StripComments(this string code)
        {
            var re = @"(@(?:""[^""]*"")+|""(?:[^""\n\\]+|\\.)*""|'(?:[^'\n\\]+|\\.)*')|//.*|/\*(?s:.*?)\*/";
            return Regex.Replace(code, re, "$1");
        }
    }

    public static class Files
    {
        public static string GetDesktopPath(this string f)
        {
            return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), f);
        }

        public static void CreateDirectoryIfNotExists(this string path)
        {
            if (Directory.Exists(path))
                return;
            Directory.CreateDirectory(path);
        }
    }
}