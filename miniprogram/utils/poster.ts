/**
 * 海报生成工具
 * @description 使用Canvas生成分享海报
 */

import { logger } from './logger'
import type { PosterConfig } from '@/types/share'

/**
 * 海报生成器
 */
class PosterGenerator {
  private canvas: any = null
  private ctx: any = null
  private readonly canvasWidth = 750
  private readonly canvasHeight = 1334

  /**
   * 初始化Canvas
   * @param canvasId Canvas元素ID
   */
  private initCanvas(canvasId: string = '#poster-canvas'): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = uni.createSelectorQuery()
      query.select(canvasId)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res && res[0]) {
            this.canvas = res[0].node
            this.ctx = this.canvas.getContext('2d')

            // 设置Canvas尺寸
            const dpr = uni.getSystemInfoSync().pixelRatio || 2
            this.canvas.width = this.canvasWidth * dpr
            this.canvas.height = this.canvasHeight * dpr
            this.ctx.scale(dpr, dpr)

            resolve()
          } else {
            reject(new Error('Canvas初始化失败'))
          }
        })
    })
  }

  /**
   * 生成海报
   * @param config 海报配置
   * @param canvasId Canvas元素ID
   * @returns 临时图片路径
   */
  async generatePoster(config: PosterConfig, canvasId: string = '#poster-canvas'): Promise<string> {
    try {
      // 初始化Canvas
      await this.initCanvas(canvasId)

      // 清空画布
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

      // 绘制背景
      await this.drawBackground()

      // 绘制主图
      await this.drawMainImage(config.mainImage)

      // 绘制标题
      this.drawTitle(config.title)

      // 绘制副标题
      if (config.subtitle) {
        this.drawSubtitle(config.subtitle)
      }

      // 绘制价格
      if (config.price) {
        this.drawPrice(config.price)
      }

      // 绘制二维码
      await this.drawQRCode(config.qrCode)

      // 绘制邀请码
      if (config.inviteCode) {
        this.drawInviteCode(config.inviteCode)
      }

      // 绘制品牌信息
      this.drawBrandInfo()

      // 导出图片
      return await this.exportImage()
    } catch (error) {
      logger.error('海报生成失败', error)
      throw error
    }
  }

  /**
   * 绘制背景
   */
  private async drawBackground(): Promise<void> {
    // 渐变背景
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight)
    gradient.addColorStop(0, '#FF9F29')
    gradient.addColorStop(1, '#FFB84D')

    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  /**
   * 绘制主图
   * @param imageUrl 图片URL
   */
  private async drawMainImage(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = this.canvas.createImage()
      image.onload = () => {
        const x = 40
        const y = 100
        const width = this.canvasWidth - 80
        const height = 500

        // 保存当前状态
        this.ctx.save()

        // 绘制圆角矩形路径
        this.drawRoundRect(x, y, width, height, 20)
        this.ctx.clip()

        // 绘制图片
        this.ctx.drawImage(image, x, y, width, height)

        // 恢复状态
        this.ctx.restore()

        resolve()
      }
      image.onerror = () => {
        logger.error('主图加载失败', imageUrl)
        reject(new Error('主图加载失败'))
      }
      image.src = imageUrl
    })
  }

  /**
   * 绘制圆角矩形路径
   * @param x X坐标
   * @param y Y坐标
   * @param width 宽度
   * @param height 高度
   * @param radius 圆角半径
   */
  private drawRoundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    this.ctx.beginPath()
    this.ctx.moveTo(x + radius, y)
    this.ctx.lineTo(x + width - radius, y)
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    this.ctx.lineTo(x + width, y + height - radius)
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    this.ctx.lineTo(x + radius, y + height)
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    this.ctx.lineTo(x, y + radius)
    this.ctx.quadraticCurveTo(x, y, x + radius, y)
    this.ctx.closePath()
  }

  /**
   * 绘制标题
   * @param title 标题文本
   */
  private drawTitle(title: string): void {
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.font = 'bold 48px sans-serif'
    this.ctx.textAlign = 'center'

    // 文字换行处理
    const maxWidth = this.canvasWidth - 80
    const lines = this.wrapText(title, maxWidth, 48)

    lines.forEach((line, index) => {
      this.ctx.fillText(line, this.canvasWidth / 2, 680 + index * 60)
    })
  }

  /**
   * 文字换行
   * @param text 文本
   * @param maxWidth 最大宽度
   * @param fontSize 字体大小
   * @returns 换行后的文本数组
   */
  private wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split('')
    const lines: string[] = []
    let currentLine = ''

    words.forEach(word => {
      const testLine = currentLine + word
      const metrics = this.ctx.measureText(testLine)

      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })

    if (currentLine) {
      lines.push(currentLine)
    }

    return lines
  }

  /**
   * 绘制副标题
   * @param subtitle 副标题文本
   */
  private drawSubtitle(subtitle: string): void {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    this.ctx.font = '32px sans-serif'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(subtitle, this.canvasWidth / 2, 800)
  }

  /**
   * 绘制价格
   * @param price 价格
   */
  private drawPrice(price: string): void {
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.font = 'bold 56px sans-serif'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`¥${price}`, this.canvasWidth / 2, 900)

    this.ctx.font = '28px sans-serif'
    this.ctx.fillText('/日均', this.canvasWidth / 2, 940)
  }

  /**
   * 绘制二维码
   * @param qrCodeUrl 二维码图片URL
   */
  private async drawQRCode(qrCodeUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = this.canvas.createImage()
      image.onload = () => {
        const size = 200
        const x = (this.canvasWidth - size) / 2
        const y = 1000

        // 绘制白色背景
        this.ctx.fillStyle = '#FFFFFF'
        this.ctx.fillRect(x - 10, y - 10, size + 20, size + 20)

        // 绘制二维码
        this.ctx.drawImage(image, x, y, size, size)

        resolve()
      }
      image.onerror = () => {
        logger.error('二维码加载失败', qrCodeUrl)
        reject(new Error('二维码加载失败'))
      }
      image.src = qrCodeUrl
    })
  }

  /**
   * 绘制邀请码
   * @param inviteCode 邀请码
   */
  private drawInviteCode(inviteCode: string): void {
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.font = 'bold 32px sans-serif'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`邀请码: ${inviteCode}`, this.canvasWidth / 2, 1240)
  }

  /**
   * 绘制品牌信息
   */
  private drawBrandInfo(): void {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    this.ctx.font = '24px sans-serif'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('长按识别小程序码，开启房车之旅', this.canvasWidth / 2, 1280)
  }

  /**
   * 导出图片
   * @returns 临时图片路径
   */
  private exportImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      uni.canvasToTempFilePath({
        canvas: this.canvas,
        success: (res) => {
          resolve(res.tempFilePath)
        },
        fail: (error) => {
          logger.error('导出图片失败', error)
          reject(error)
        }
      })
    })
  }

  /**
   * 保存图片到相册
   * @param imagePath 图片路径
   */
  async saveToAlbum(imagePath: string): Promise<void> {
    try {
      // 请求保存权限
      await uni.authorize({
        scope: 'scope.writePhotosAlbum'
      })

      // 保存图片
      await uni.saveImageToPhotosAlbum({
        filePath: imagePath
      })

      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })

      logger.info('海报保存成功')
    } catch (error: unknown) {
      logger.error('海报保存失败', error)

      if (error && typeof error === 'object' && 'errMsg' in error) {
        const errMsg = (error as { errMsg: string }).errMsg

        if (errMsg.includes('auth deny')) {
          // 权限被拒绝，引导用户开启
          uni.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting()
              }
            }
          })
        } else {
          uni.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
      } else {
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    }
  }
}

// 导出单例
export const posterGenerator = new PosterGenerator()

/**
 * 便捷方法：生成海报
 */
export function generatePoster(config: PosterConfig, canvasId?: string): Promise<string> {
  return posterGenerator.generatePoster(config, canvasId)
}

/**
 * 便捷方法：保存到相册
 */
export function savePosterToAlbum(imagePath: string): Promise<void> {
  return posterGenerator.saveToAlbum(imagePath)
}
