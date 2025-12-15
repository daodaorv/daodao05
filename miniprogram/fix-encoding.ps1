# 修复小程序端所有文件的编码问题
# 将所有文件转换为 UTF-8 编码

$ErrorActionPreference = "Continue"

# 定义要检查的文件模式
$patterns = @(
    "pages/**/*.vue",
    "components/**/*.vue",
    "api/**/*.ts",
    "stores/**/*.ts",
    "utils/**/*.ts",
    "mock/**/*.ts",
    "types/**/*.ts",
    "App.vue"
)

$fixedFiles = @()
$errorFiles = @()
$totalFiles = 0

Write-Host "开始扫描和修复编码问题..." -ForegroundColor Cyan

foreach ($pattern in $patterns) {
    $files = Get-ChildItem -Path $pattern -Recurse -ErrorAction SilentlyContinue

    foreach ($file in $files) {
        $totalFiles++
        Write-Host "检查: $($file.FullName)" -ForegroundColor Gray

        try {
            # 读取文件内容（自动检测编码）
            $content = Get-Content -Path $file.FullName -Raw -ErrorAction Stop

            # 检查是否包含非 UTF-8 字符
            $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
            $utf8 = New-Object System.Text.UTF8Encoding($false)

            try {
                $decoded = $utf8.GetString($bytes)
                # 如果能成功解码，检查是否有 BOM
                if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
                    Write-Host "  发现 BOM，移除中..." -ForegroundColor Yellow
                    # 移除 BOM 并重新保存
                    $content = Get-Content -Path $file.FullName -Raw
                    [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding($false)))
                    $fixedFiles += $file.FullName
                    Write-Host "  ✓ 已修复 (移除BOM)" -ForegroundColor Green
                }
            } catch {
                # 解码失败，说明不是有效的 UTF-8
                Write-Host "  发现编码问题，转换为 UTF-8..." -ForegroundColor Yellow

                # 尝试多种编码读取
                $encodings = @(
                    [System.Text.Encoding]::Default,
                    [System.Text.Encoding]::GetEncoding("GB2312"),
                    [System.Text.Encoding]::GetEncoding("GBK"),
                    [System.Text.Encoding]::GetEncoding("GB18030")
                )

                $success = $false
                foreach ($enc in $encodings) {
                    try {
                        $content = [System.IO.File]::ReadAllText($file.FullName, $enc)
                        # 保存为 UTF-8 无 BOM
                        [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding($false)))
                        $fixedFiles += $file.FullName
                        Write-Host "  ✓ 已修复 (使用 $($enc.EncodingName))" -ForegroundColor Green
                        $success = $true
                        break
                    } catch {
                        continue
                    }
                }

                if (-not $success) {
                    $errorFiles += $file.FullName
                    Write-Host "  ✗ 修复失败" -ForegroundColor Red
                }
            }
        } catch {
            $errorFiles += $file.FullName
            Write-Host "  ✗ 处理失败: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复完成统计" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "总文件数: $totalFiles" -ForegroundColor White
Write-Host "已修复: $($fixedFiles.Count)" -ForegroundColor Green
Write-Host "失败: $($errorFiles.Count)" -ForegroundColor Red

if ($fixedFiles.Count -gt 0) {
    Write-Host "`n已修复的文件:" -ForegroundColor Green
    $fixedFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
}

if ($errorFiles.Count -gt 0) {
    Write-Host "`n修复失败的文件:" -ForegroundColor Red
    $errorFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
}

Write-Host "`n完成!" -ForegroundColor Cyan
