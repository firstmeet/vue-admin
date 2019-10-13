<template>
	<div class="app-container">
		<el-row style="margin-bottom: 20px">
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<el-button type="primary" @click="create()">创建</el-button>
				</div>
			</el-col>
		</el-row>
		<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
			<el-table-column align="center" label="ID" width="95">
				<template slot-scope="scope">
					{{ scope.row.id }}
				</template>
			</el-table-column>
			<el-table-column label="商品名称" align="center">
				<template slot-scope="scope">
					{{ scope.row.name }}
				</template>
			</el-table-column>
			<el-table-column label="封面图片" align="center">
				<template slot-scope="scope">
					<el-image :src="JSON.parse(scope.row.cover)[0]" class="image">
						<div slot="placeholder" class="image-slot">
							加载中<span class="dot">...</span>
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column label="销售价" align="center">
				<template slot-scope="scope">
					{{ scope.row.sale_price }}
				</template>
			</el-table-column>
			<el-table-column label="商品分类" align="center">
				<template slot-scope="scope">
					{{ scope.row.category.name }}
				</template>
			</el-table-column>
			<el-table-column label="商品类型" align="center">
				<template slot-scope="scope">
					{{ scope.row.goods_type.name }}
				</template>
			</el-table-column>
			<el-table-column label="原价" align="center">
				<template slot-scope="scope">
					{{ scope.row.origin_price }}
				</template>
			</el-table-column>
			<!--      <el-table-column label="排序"  align="center">-->
			<!--        <template slot-scope="scope">-->
			<!--          {{scope.row.sort}}-->
			<!--        </template>-->
			<!--      </el-table-column>-->
			<el-table-column label="状态" align="center">
				<template slot-scope="scope">
					{{scope.row.status|statusFilter}}
				</template>
			</el-table-column>

			<!--      <el-table-column class-name="status-col" label="Status" width="110" align="center">-->
			<!--        <template slot-scope="scope">-->
			<!--          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
			<!--        </template>-->
			<!--      </el-table-column>-->
			<el-table-column align="center" prop="created_at" label="创建时间" width="200">
				<template slot-scope="scope">
					<i class="el-icon-time" />
					<span>{{ scope.row.created_at }}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="to_edit(scope.row.id)" type="text" size="small">编辑</el-button>
					<el-button @click="deletes(scope.row.id)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination background layout="prev, pager, next" :total="1000" @current-change="select_page">
		</el-pagination>
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="840px">
			<el-form ref="dataForm" :model="temp" label-position="left" label-width="230px" style="width: 600px; margin-left:50px;">
				<el-form-item label="类型名称" prop="name" label-width="100px">
					<el-input v-model="temp.name" />
				</el-form-item>
				<el-form-item label="封面图片" prop="cover" label-width="100px">
					<upload :imageUrl="temp.cover" @callback="handleAvatarSuccess"></upload>
				</el-form-item>
				<el-form-item label="商品分类" prop="category_id" label-width="100px">
					<el-select v-model="temp.category_id" placeholder="请选择">
						<el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否开启多规格" prop="other_sku" label-width="130px">
					<el-switch v-model="temp.other_sku" active-color="#13ce66" inactive-color="#ff4949" inactive-value="0"
					 active-value="1">
					</el-switch>
				</el-form-item>
				<el-form-item label="商品类型" prop="goods_type_id" label-width="100px" v-if="temp.other_sku==1">
					<el-select v-model="temp.goods_type_id" placeholder="请选择">
						<el-option v-for="item in goodsType" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="规格" v-if="temp.other_sku==1" prop="stock" label-width="100px">
					<el-row v-for="item in specList" :key="item.id">
						<el-button size="small" disabled>{{item.name}}:</el-button>
						<el-button size="small" v-for="item2 in item.spec_item" :key="item2.id" @click="setSku(item.id,item2.id,item2.item)">{{item2.item}}</el-button>

					</el-row>
					<el-row v-for="(item,index) in skuList" :key="item.index" :gutter="2">
						<el-col :span="4" v-for="item2 in item.sku" :key="item2.id">
							<el-input disabled="" :value="item2.name"></el-input>
						</el-col>
						<el-col :span="4">
							<el-input v-model="item.origin_price" label="原价" placeholder="原价"></el-input>
						</el-col>
						<el-col :span="5">
							<el-input v-model="item.sale_price" placeholder="销售价"></el-input>
						</el-col>
						<el-col :span="4">
							<el-input v-model="item.stock" placeholder="库存"></el-input>
						</el-col>
												<el-col :span="3">
							<el-button size="medium" type="danger" @click="delete_sku(index)">删除</el-button>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="销售价" prop="sale_price" label-width="100px">
					<el-input v-model="temp.sale_price" />
				</el-form-item>
				<el-form-item label="原价" prop="sale_price" label-width="100px">
					<el-input v-model="temp.origin_price" />
				</el-form-item>
				<el-form-item label="是否推荐" prop="recommend" label-width="100px">
					<el-radio v-model="temp.recommend" label="1">是</el-radio>
					<el-radio v-model="temp.recommend" label="0">否</el-radio>
				</el-form-item>
				<el-form-item label="详情" prop="body" label-width="100px">
					<tinymce v-model="temp.body" :width="width"></tinymce>
				</el-form-item>

				<el-form-item label="排序" prop="sort" label-width="100px">
					<el-input v-model="temp.sort" />
				</el-form-item>
				<el-form-item label="状态" prop="status" label-width="100px">
					<el-radio v-model="temp.status" label="1">上架</el-radio>
					<el-radio v-model="temp.status" label="0">下架</el-radio>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">
					Cancel
				</el-button>
				<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
					Confirm
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import {
		update,
		create,
		getList,
		deletes
	} from '@/api/goods'
	import {
		getList as getCategoryList
	} from '@/api/category'
	import {
		getList as getGoodsTypeList
	} from '@/api/goods_type'
	import {
		findByType as getSpecList
	} from '@/api/spec'
	import Upload from '@/components/Upload'
	import Tinymce from '@/components/Tinymce'


	export default {
		components: {
			Upload,
			Tinymce
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: '下架',
					1: '上架',
				}
				return statusMap[status]
			}
		},
		watch: {
			"temp.goods_type_id": function(newVal, oldVal) {
				getSpecList(newVal).then(res => {
					this.specList = res.data
				})
			}
		},
		data() {
			return {
				width: "600px",
				current_page: 1,
				total_page: "",
				page_size: 10,
				category: [],
				goodsType: [],
				specList: [],
				like_arr: [],
				skuList: [],
				sku: [],
				list: null,
				listLoading: true,
				uploadVisible: false,
				type: [{
						"id": 1,
						"text": "图片"
					},
					{
						"id": 2,
						"text": "资源"
					}
				],
				temp: {
					id: undefined,
					name: "",
					cover: "",
					category_id: "",
					goods_type_id: "",
					origin_price: "",
					sale_price: "",
					other_sku: "0",
					recommend: "0",
					body: "",
					sort: "1",
					status: "1",
					created_at: ""
				},
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: 'Edit'
				},
				dialogPvVisible: false,
			}
		},
		created() {
			this.fetchData()
		},
		methods: {
			fetchData(current_page = 1, page_size = 10) {
				this.listLoading = true
				getList({
					"current_page": current_page,
					"page_size": page_size
				}).then(response => {
					this.list = response.data
					this.listLoading = false
				})
				getCategoryList().then(res => {
					this.category = res.data
					this.listLoading = false
				})
				getGoodsTypeList().then(res => {
					this.goodsType = res.data
					this.listLoading = false
				})
			},
      to_edit(id){
        this.$router.push({path:"/goods/edit/"+id})
      },
			create() {
				this.$router.push({ path: '/goods/add' })
			},
			createData() {
				this.temp.sku=JSON.stringify(this.skuList)
				create(this.temp).then(res => {
					this.list.push(res.data)
				})
				this.dialogFormVisible = false;
			},
			updateData() {
				this.temp.sku=JSON.stringify(this.skuList)
				update(this.temp).then(res => {
					for (const v of this.list) {
						if (v.id === this.temp.id) {
							const index = this.list.indexOf(v)
							this.list.splice(index, 1, res.data)
							break
						}
					}
					this.dialogFormVisible = false
					this.$notify({
						title: 'Success',
						message: 'Update Successfully',
						type: 'success',
						duration: 2000
					})
				})
			},
			deletes(id) {
				deletes(id).then(res => {
					for (const v of this.list) {
						if (v.id === id) {
							const index = this.list.indexOf(v)
							this.list.splice(index, 1)
							break
						}
					}
					this.$notify({
						title: 'Success',
						message: 'Delete Successfully',
						type: 'success',
						duration: 2000
					})
				})
			},
			changeStock() {
				var list = this.specList
				var ch_list = {}
				// list.forEach((item,key)=>{
				//
				// })
			},
			delete_sku(index){
				this.skuList.splice(index,1)
			},
			handleClick(row) {
				this.dialogStatus = "edit"
				// this.temp.id = row.id
				// this.temp.name = row.name
				// this.temp.avatar = row.avatar
				this.temp.id = row.id
				this.temp.name = row.name
				this.temp.cover = row.cover
				this.temp.body = row.body
				this.temp.other_sku = row.other_sku.toString()
				this.temp.goods_type_id = row.goods_type_id
				this.temp.category_id = row.category_id
				this.temp.recommend = row.recommend.toString()
				this.temp.origin_price = row.origin_price.toString()
				this.temp.sale_price = row.sale_price.toString()
				this.temp.status = row.status.toString()
				// this.temp.sort=row.sort.toString()
				this.temp.created_at = row.created_at
				var sku=row.sku
				this.skuList=[]
				sku.forEach((item,index)=>{

					var sku_list=[]
					var spec=JSON.parse(item.spec)
					var item_index=0
					var text_split=item.spec_text.split(",")
					spec.forEach((item2,index)=>{
						let x={}
						 var item_split=item2.split(":")
						 x.id=parseInt(item_split[1])
						 x.name=text_split[item_index]

						 x.spec_id=parseInt(item_split[0])

						 sku_list.push(x)

						 item_index++
					})
					var y={}
					console.log(item.origin_price)
					y.sku=sku_list
					y.origin_price=item.origin_price.toString()
					y.sale_price=item.sale_price.toString()
					y.stock=item.stock.toString()
					this.skuList.push(y)
				})
				// this.skuList=sku
				this.dialogFormVisible = true
			},
			handleUpload() {
				this.uploadVisible = true
			},
			handleAvatarSuccess(res, file) {
				this.uploadVisible = false
				this.temp.cover = process.env.VUE_APP_BASE_API + "/" + res.data;
			},
			select_page(current_page) {
				this.current_page = current_page
				this.fetchData(current_page)
			},
			setSku(spec_id, id, name) {
				if (this.sku.length == 0) {
					var sku = {}
					sku.id = id
					sku.spec_id = spec_id
					sku.name = name
					this.sku.push(sku)
				} else {
					const x = this.sku.filter(v => (v.spec_id == spec_id))
					if (x.length > 0) {
						this.$message.error('不可添加相同的属性');
						return false
					} else {
						var sku = {}
						sku.id = id
						sku.spec_id = spec_id
						sku.name = name
						this.sku.push(sku)
					}
				}
				if (this.sku.length == this.specList.length) {
					var status = true
					var _this = this
					this.skuList.every((item, index) => {
						this.sku.every((item2, index2) => {
							item.sku.every((item3, index3) => {
								console.log(item3)
								console.log(item2)
								if (item3.spec_id == item2.spec_id && item3.id == item2.id) {
									_this.like_arr.push(item2)
								}
								return true
							})
							return true
						})

						console.log(_this.like_arr)
						if (_this.like_arr.length > 0 && (_this.like_arr.length == _this.specList.length)) {
							this.$message.error("不能添加相同的规格")
							_this.like_arr = []
							_this.sku = []
							status = false
							return false

						} else {
							_this.like_arr = []
							return true
						}


					})


					if (status) {
						let data = {}
						data.sku = this.sku
						data.origin_price = ""
						data.sale_price = ""
						data.stock = ""
						this.skuList.push(data)
						this.sku = []
						this.like_arr = []
					}
				}

			}
		}







	}
</script>
<style scoped>
	.image {
		width: 200px;
		height: 150px;
	}

	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}
</style>
