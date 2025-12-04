<template>
  <div class="card content-box">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px">
      <!-- 个人基本信息 -->
      <el-divider content-position="left">个人基本信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="ruleForm.gender">
              <el-radio value="male">男</el-radio>
              <el-radio value="female">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birthDate">
            <el-date-picker v-model="ruleForm.birthDate" type="date" placeholder="请选择出生日期" style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="ruleForm.idCard" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="民族" prop="ethnicity">
            <el-select v-model="ruleForm.ethnicity" placeholder="请选择民族">
              <el-option label="汉族" value="han" />
              <el-option label="蒙古族" value="mongolian" />
              <el-option label="回族" value="hui" />
              <el-option label="藏族" value="tibetan" />
              <el-option label="维吾尔族" value="uyghur" />
              <el-option label="苗族" value="miao" />
              <el-option label="彝族" value="yi" />
              <el-option label="壮族" value="zhuang" />
              <el-option label="布依族" value="buyi" />
              <el-option label="朝鲜族" value="chaoxian" />
              <el-option label="满族" value="manchu" />
              <el-option label="侗族" value="dong" />
              <el-option label="瑶族" value="yao" />
              <el-option label="白族" value="bai" />
              <el-option label="土家族" value="tujia" />
              <el-option label="哈尼族" value="hani" />
              <el-option label="哈萨克族" value="kazak" />
              <el-option label="傣族" value="dai" />
              <el-option label="黎族" value="li" />
              <el-option label="傈僳族" value="lisu" />
              <el-option label="佤族" value="wa" />
              <el-option label="畲族" value="she" />
              <el-option label="高山族" value="gaoshan" />
              <el-option label="拉祜族" value="lahu" />
              <el-option label="水族" value="sui" />
              <el-option label="东乡族" value="dongxiang" />
              <el-option label="纳西族" value="naxi" />
              <el-option label="景颇族" value="jingpo" />
              <el-option label="柯尔克孜族" value="kirgiz" />
              <el-option label="土族" value="tu" />
              <el-option label="达斡尔族" value="daur" />
              <el-option label="仫佬族" value="mulao" />
              <el-option label="羌族" value="qiang" />
              <el-option label="布朗族" value="bulang" />
              <el-option label="撒拉族" value="salar" />
              <el-option label="毛南族" value="maonan" />
              <el-option label="仡佬族" value="gelao" />
              <el-option label="锡伯族" value="xibe" />
              <el-option label="阿昌族" value="achang" />
              <el-option label="普米族" value="pumi" />
              <el-option label="塔吉克族" value="tajik" />
              <el-option label="怒族" value="nu" />
              <el-option label="乌孜别克族" value="uzbek" />
              <el-option label="俄罗斯族" value="russian" />
              <el-option label="鄂温克族" value="ewenki" />
              <el-option label="德昂族" value="deang" />
              <el-option label="保安族" value="baoan" />
              <el-option label="裕固族" value="yugur" />
              <el-option label="京族" value="jing" />
              <el-option label="塔塔尔族" value="tatar" />
              <el-option label="独龙族" value="drung" />
              <el-option label="鄂伦春族" value="orochon" />
              <el-option label="赫哲族" value="hezhe" />
              <el-option label="门巴族" value="monba" />
              <el-option label="珞巴族" value="lhoba" />
              <el-option label="基诺族" value="jino" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="婚姻状况" prop="maritalStatus">
            <el-select v-model="ruleForm.maritalStatus" placeholder="请选择婚姻状况">
              <el-option label="未婚" value="single" />
              <el-option label="已婚" value="married" />
              <el-option label="离婚" value="divorced" />
              <el-option label="丧偶" value="widowed" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="职业" prop="occupation">
        <el-input v-model="ruleForm.occupation" placeholder="请输入职业" />
      </el-form-item>

      <!-- 联系方式 -->
      <el-divider content-position="left">联系方式</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号码" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入电子邮箱" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="联系地址" prop="address">
        <el-input v-model="ruleForm.address" placeholder="请输入联系地址" />
      </el-form-item>

      <!-- 医疗相关信息 -->
      <el-divider content-position="left">医疗相关信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="就诊科室" prop="department">
            <el-select v-model="ruleForm.department" placeholder="请选择就诊科室">
              <el-option label="内科" value="internal" />
              <el-option label="外科" value="surgery" />
              <el-option label="儿科" value="pediatrics" />
              <el-option label="妇产科" value="obstetrics" />
              <el-option label="骨科" value="orthopedics" />
              <el-option label="神经科" value="neurology" />
              <el-option label="眼科" value="ophthalmology" />
              <el-option label="耳鼻喉科" value="ent" />
              <el-option label="口腔科" value="stomatology" />
              <el-option label="皮肤科" value="dermatology" />
              <el-option label="精神科" value="psychiatry" />
              <el-option label="传染科" value="infectious" />
              <el-option label="急诊科" value="emergency" />
              <el-option label="体检科" value="physical" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="就诊类型" prop="visitType">
            <el-select v-model="ruleForm.visitType" placeholder="请选择就诊类型">
              <el-option label="初诊" value="first" />
              <el-option label="复诊" value="follow" />
              <el-option label="急诊" value="emergency" />
              <el-option label="体检" value="physical" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="主诉" prop="chiefComplaint">
        <el-input v-model="ruleForm.chiefComplaint" type="textarea" placeholder="请输入主诉" />
      </el-form-item>

      <el-form-item label="现病史" prop="presentIllness">
        <el-input v-model="ruleForm.presentIllness" type="textarea" placeholder="请输入现病史" />
      </el-form-item>

      <el-form-item label="既往史" prop="pastHistory">
        <el-input v-model="ruleForm.pastHistory" type="textarea" placeholder="请输入既往史" />
      </el-form-item>

      <el-form-item label="过敏史" prop="allergyHistory">
        <el-input v-model="ruleForm.allergyHistory" type="textarea" placeholder="请输入过敏史" />
      </el-form-item>

      <el-form-item label="家族史" prop="familyHistory">
        <el-input v-model="ruleForm.familyHistory" type="textarea" placeholder="请输入家族史" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="peopleForm">
import { reactive, ref } from "vue";
import { checkPhoneNumber } from "@/utils/eleValidate";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const ruleFormRef = ref<FormInstance>();
const router = useRouter();
const ruleForm = reactive({
  name: "",
  gender: "",
  birthDate: "",
  idCard: "",
  ethnicity: "",
  maritalStatus: "",
  occupation: "",
  phone: "",
  email: "",
  address: "",
  department: "",
  visitType: "",
  chiefComplaint: "",
  presentIllness: "",
  pastHistory: "",
  allergyHistory: "",
  familyHistory: "",
  remark: ""
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 20, message: "姓名长度应在 2 到 20 个字符之间", trigger: "blur" }
  ],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  birthDate: [{ type: "date", required: true, message: "请选择出生日期", trigger: "change" }],
  idCard: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    {
      pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      message: "请输入有效的身份证号",
      trigger: "blur"
    }
  ],
  ethnicity: [{ required: true, message: "请选择民族", trigger: "change" }],
  maritalStatus: [{ required: true, message: "请选择婚姻状况", trigger: "change" }],
  phone: [{ required: true, validator: checkPhoneNumber, trigger: "blur" }],
  email: [{ type: "email", required: true, message: "请输入有效的电子邮箱", trigger: "blur" }],
  address: [{ required: true, message: "请输入联系地址", trigger: "blur" }],
  department: [{ required: true, message: "请选择就诊科室", trigger: "change" }],
  visitType: [{ required: true, message: "请选择就诊类型", trigger: "change" }],
  chiefComplaint: [{ required: true, message: "请输入主诉", trigger: "blur" }],
  presentIllness: [{ required: true, message: "请输入现病史", trigger: "blur" }],
  pastHistory: [{ required: true, message: "请输入既往史", trigger: "blur" }],
  allergyHistory: [{ required: true, message: "请输入过敏史", trigger: "blur" }],
  familyHistory: [{ required: true, message: "请输入家族史", trigger: "blur" }]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessage.success("提交的数据为 : " + JSON.stringify(ruleForm));
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
