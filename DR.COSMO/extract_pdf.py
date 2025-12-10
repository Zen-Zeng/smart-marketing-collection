import PyPDF2

# 打开PDF文件
pdf_file = open('/Users/andornot/iCloud云盘/Documents/工作资料/AOT/DAO/智能营销/DR.COSMO/drcosmo_品牌介绍书_cn(2).pdf', 'rb')

# 创建PDF阅读器对象
pdf_reader = PyPDF2.PdfReader(pdf_file)

# 提取文本内容
text = ''
for page_num in range(len(pdf_reader.pages)):
    page = pdf_reader.pages[page_num]
    text += page.extract_text()

# 关闭PDF文件
pdf_file.close()

# 保存提取的文本到文件
with open('/Users/andornot/iCloud云盘/Documents/工作资料/AOT/DAO/智能营销/DR.COSMO/brand_guide.txt', 'w', encoding='utf-8') as f:
    f.write(text)

print('PDF内容已提取到brand_guide.txt')